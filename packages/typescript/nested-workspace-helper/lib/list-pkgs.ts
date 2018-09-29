import * as fsx from 'fs-extra'
import * as fsTreeUtils from 'fs-tree-utils'
import { Package } from './types'

export type ListPackageResult = Promise<Package.List>

/**
 * List all packages in a monorepo
 * @param dirname Directory of the monorepo
 */
export async function listAllPackages (dirname: string): ListPackageResult {
  type TraversalResultItem = fsTreeUtils.Traverse.Result.Item

  const createItem = async (x: TraversalResultItem): Promise<Package.ListItem> =>
    ({ path: x.container, manifestFile: x.path, manifestContent: await fsx.readJSON(x.path) })

  return Promise.all(
    (
      await fsTreeUtils.traverse(dirname, {
        deep: x => !/node_modules/.test(x.item)
      })
    )
      .filter(x => x.item === 'package.json')
      .filter(x => x.stats.isFile())
      .map(createItem)
  )
}

export default listAllPackages
