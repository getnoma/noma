import path from 'path'
import resolve from 'resolve'
import toposort from 'toposort'
import util from 'util'
import { loadJsonFile } from '@noma/helper-json'

const resolveAsync = util.promisify(resolve)

export async function loadPackageObj (packageDir) {
  const packageJsonFile = path.join(packageDir, 'package.json')

  return loadJsonFile(packageJsonFile)
}

export async function loadPackageDependencies (packageName, basedir, dependencyFilter) {
  const packageDependencyGraph = await loadPackageDependencyGraph(packageName, basedir, dependencyFilter)

  const { nodes } = packageDependencyGraph

  nodes.pop()

  return nodes
}

export async function loadPackageDependencyGraph (packageName, basedir, dependencyFilter) {
  const packageDir = await resolvePackageDir(packageName, basedir)
  const packageObj = await loadPackageObj(packageDir)

  const dependencies = { ...packageObj.dependencies, ...packageObj.peerDependencies }
  const dependencyPackageNames = Object.keys(dependencies).filter(dependencyFilter)

  const packageDependencyGraph = { nodes: new Set([packageName]), edges: new Set() }

  for (const dependencyPackageName of dependencyPackageNames) {
    try {
      const dependencyPackageDependencyGraph = await loadPackageDependencyGraph(
        dependencyPackageName,
        basedir,
        dependencyFilter
      )

      packageDependencyGraph.edges.add([packageName, dependencyPackageName])

      dependencyPackageDependencyGraph.edges.forEach(edge => packageDependencyGraph.edges.add(edge))
      dependencyPackageDependencyGraph.nodes.forEach(node => packageDependencyGraph.nodes.add(node))
    } catch (err) {
      if (!(packageObj.peerDependenciesMeta && packageObj.peerDependenciesMeta[dependencyPackageName] && packageObj.peerDependenciesMeta[dependencyPackageName].optional === true)) {
        throw err
      }
    }
  }

  packageDependencyGraph.edges = [...packageDependencyGraph.edges]
  packageDependencyGraph.nodes = [...packageDependencyGraph.nodes]

  packageDependencyGraph.nodes = toposort
    .array(packageDependencyGraph.nodes, packageDependencyGraph.edges)
    .reverse()

  return packageDependencyGraph
}

export async function resolvePackageDir (id, basedir) {
  let packageDir

  await resolveAsync(id, {
    basedir,
    packageFilter: (pkg, pkgfile) => {
      packageDir = path.dirname(pkgfile)

      return pkg
    }
  })

  return packageDir
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
