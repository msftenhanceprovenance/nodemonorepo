import listAllPackages from './list-pkgs'
import {DependencyList, DependencyMap, DependencyType, PackageDict, PackageList} from './types'

export type DependencyMapResult = Promise<DependencyMap>

export async function getDependencyMap (dirname: string): DependencyMapResult {
  return getDependencyMap.fromList(await listAllPackages(dirname))
}

export namespace getDependencyMap {
  export function fromList (pkgs: PackageList): DependencyMap {
    const result: DependencyMap = {}

    function dict2list (dict: PackageDict, type: DependencyType): DependencyList {
      const result: DependencyList = []

      for (const [name, requirement] of Object.entries(dict)) {
        for (const {manifestContent} of pkgs) {
          if (manifestContent.name !== name) continue
          const {version = '0.0.0'} = manifestContent
          result.push({name, version, type, requirement})
          break
        }
      }

      return result
    }

    for (const item of pkgs) {
      const {
        dependencies = {},
        devDependencies = {},
        peerDependencies = {}
      } = item.manifestContent

      result[item.path] = [
        ...dict2list(dependencies, 'prod'),
        ...dict2list(devDependencies, 'dev'),
        ...dict2list(peerDependencies, 'peer')
      ]
    }

    return result
  }
}

export default getDependencyMap