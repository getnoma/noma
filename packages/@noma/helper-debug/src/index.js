import { resolvePackageNameSync } from '@noma/helper-packages'
import callsites from 'callsites'
import debug from 'debug'
import path from 'path'
import url from 'url'

export function createDebug (namespace) {
  if (typeof namespace !== 'string') {
    const callsite = callsites()[1]
    namespace = getNamespaceFromCallsite(callsite)
  }

  return debug(namespace)
}

export function enableDebug (namespace) {
  if (typeof namespace !== 'string') {
    const callsite = callsites()[1]
    namespace = getNamespaceFromCallsite(callsite)
  }

  debug.enable(namespace)
}

function getNamespaceFromCallsite (callsite) {
  const file = url.fileURLToPath(callsite.getFileName())
  const basedir = path.dirname(file)
  const id = ['.', path.basename(file)].join('/')

  return resolvePackageNameSync(id, basedir)
}
