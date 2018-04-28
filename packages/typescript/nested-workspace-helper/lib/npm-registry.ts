import {URL} from 'url'
import fetch from 'node-fetch'

import {
  Basic,
  NetworkStatus,
  Registry,
  PackageRegistryResponse,
  PackageVersionRegistryResponse
} from './types'

export const NPM_REGISTRY = 'http://registry.npmjs.org'
export const YARN_REGISTRY = 'https://registry.yarnpkg.com'

/**
 * Create an URL of registry
 */
export const mkhref = (
  segments: string[],
  registry: string
) => new URL(segments.join('/'), registry).href

class NetworkError extends Error {
  public readonly name = 'NetworkError'
}

/**
 * @param registry Registry URL origin
 * @returns A collection of functions
 */
export function createFactory (registry: string = NPM_REGISTRY) {
  async function getRegistry<Result> (...segments: string[]): Promise<Result | NetworkStatus> {
    const response = await fetch(mkhref(segments, registry))

    if (!response.ok) {
      if (response.status === 404) {
        return 'NotFound'
      }

      throw new NetworkError(
        `Server response with status ${response.status} (${response.statusText}) instead of OK`
      )
    }

    return {...await response.json()}
  }

  /**
   * @param pkg Package name
   * @returns Information of the package with all of its versions
   */
  function getAllVersions (pkg: Basic.PackageName): Promise<PackageRegistryResponse> {
    return getRegistry(pkg)
  }

  /**
   * @param pkg Package name
   * @param version Package version
   * @returns Information of a single version of the package
   */
  function getSpecificVersion (
    pkg: Basic.PackageName,
    version: Basic.PackageVersion
  ): Promise<PackageVersionRegistryResponse> {
    return getRegistry(pkg, version)
  }

  /**
   * @param pkg Package name
   * @returns Information of the latest version of the package
   */
  function getLatestVersion (pkg: Basic.PackageName): Promise<PackageVersionRegistryResponse> {
    return getSpecificVersion(pkg, 'latest')
  }

  return {
    registry,
    getRegistry,
    getAllVersions,
    getSpecificVersion,
    getLatestVersion
  }
}

export namespace createFactory {
  export const REGISTRIES = {
    NPM: NPM_REGISTRY,
    YARN: YARN_REGISTRY
  }

  export const npm = createFactory(NPM_REGISTRY)
  export const yarn = createFactory(YARN_REGISTRY)
}

export default createFactory
