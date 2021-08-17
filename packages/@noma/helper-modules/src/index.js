import resolve from 'resolve'
import url from 'url'
import util from 'util'
import path from 'path'

const resolveAsync = util.promisify(resolve)

export async function loadModule (id, basedir) {
  const { file } = await resolveModule(id, basedir)
  const { href } = url.pathToFileURL(file)

  return import(href)
}

export async function resolveModule (id, basedir) {
  let packageDir
  let packageFile
  let packageObj

  const moduleFile = await resolveAsync(id, {
    basedir,
    includeCoreModules: true,
    moduleDirectory: [
      'node_modules',
      '.'
    ],
    preserveSymlinks: true,
    packageFilter: (_packageObj, _packageFile) => {
      packageDir = path.dirname(_packageFile)
      packageFile = _packageFile
      packageObj = _packageObj

      return _packageObj
    },
    pathFilter: (pkg, path, relativePath) => {
      if (!pkg.exports) {
        return relativePath
      }
  
      return pkg.exports['./' + relativePath]
    }
  })

  const moduleDir = path.dirname(moduleFile)

  return {
    id,
    dir: moduleDir,
    file: moduleFile,
    package: {
      dir: packageDir,
      file: packageFile,
      obj: packageObj
    }
  }
}
