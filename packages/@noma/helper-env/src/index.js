import { createDebug } from '@noma/helper-debug'
import { loadJsonFile } from '@noma/helper-json'
import path from 'path'

const debug = createDebug()

try {
  const envPath = path.join(process.cwd(), 'env.json')
  const env = await loadJsonFile(envPath)

  debug('loaded %s', envPath)

  Object.keys(env).forEach(key => {
    setProcessEnvVar(key, env[key])
  })
} catch (err) {
  debug('env.json not loaded')
}

function setProcessEnvVar (name, value) {
  debug('set process.env.%s = "%s"', name, value)
  process.env[name] = value
}
