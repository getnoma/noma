import path from 'path'
import resolve from 'resolve'
import { loadJsonFile } from '@noma/helper-json'
import { resolveModule } from  '@noma/helper-modules'

export async function loadPackages (id, basedir, dependencyFilter) {
  const moduleObj = await resolveModule(id, basedir)

  const packageObj = {
    name: moduleObj.package.obj.name,
    version: moduleObj.package.obj.version,
    dir: moduleObj.package.dir,
    file: moduleObj.package.file,
    module: {
      id: moduleObj.id,
      dir: moduleObj.dir,
      file: moduleObj.file
    },
    dependencies: filterObject( moduleObj.package.obj.dependencies || {}, dependencyFilter),
    peerDependencies: filterObject( moduleObj.package.obj.peerDependencies || {}, dependencyFilter),
    peerDependenciesMeta: filterObject( moduleObj.package.obj.peerDependenciesMeta || {}, dependencyFilter)
  }

  const dependencyPackageNames = Object.keys({
    ...packageObj.dependencies,
    ...packageObj.peerDependencies
  })

  const dependencyPackagesPromises = dependencyPackageNames.map(packageName => 
    loadPackages(
      packageName,
      basedir,
      dependencyFilter
    )
    .catch(err => {
      if (!(packageObj.peerDependenciesMeta && packageObj.peerDependenciesMeta[packageName] && packageObj.peerDependenciesMeta[packageName].optional === true)) {
        throw err
      }
    })
  )

  const dependencyPackages = await Promise.all(dependencyPackagesPromises)

  const flattenedAndFilteredDependencyPackages = dependencyPackages
    .flat()
    .filter(Boolean)

  return [ packageObj, ...flattenedAndFilteredDependencyPackages ]
}

export async function loadPackageObj (packageDir) {
  const packageJsonFile = path.join(packageDir, 'package.json')

  return loadJsonFile(packageJsonFile)
}

export function resolvePackageNameSync (id, basedir) {
  let packageName

  resolve.sync(id, {
    basedir,
    packageFilter: pkg => {
      packageName = pkg.name

      return pkg
    }
  })

  return packageName
}

export async function resolvePackageAsync (id, basedir) {
  let package2

  await resolveAsync(id, {
    basedir,
    packageFilter: pkg => {
      package2 = pkg.name

      return pkg
    }
  })

  return package2
}

function filterObject(object, filter) {
  if (object === null || object === undefined) {
    return object;
  }

  const objectEntries = Object.entries(object);
  const filteredObjectEntries = objectEntries.filter(([ key ]) => filter(key))
  const filteredObject = Object.fromEntries(filteredObjectEntries)

  return filteredObject
}