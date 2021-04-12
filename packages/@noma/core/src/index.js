import '@noma/helper-env'

import { getConfigDirs, loadConfig, loadConfigSchema, validateConfig } from '@noma/helper-config'
import { createDebug, enableDebug } from '@noma/helper-debug'
import { loadModule } from '@noma/helper-modules'
import { isString, mergeObjects, replaceValues } from '@noma/helper-objects'
import { loadPackageDependencies, resolvePackageDir } from '@noma/helper-packages'
import Mustache from 'mustache'
import dotProp from 'dot-prop'

const DEFAULT_ENV = 'development'

const debug = createDebug()

export default async function (id = '.', options = {}) {
  const defaultOptions = {
    debug: false
  }

  options = { ...defaultOptions, ...options }

  const basedir = getCurrentWorkingDirectory()
  const environment = getEnvironment()

  if (options.debug) {
    enableDebug()
  }

  debug('id: %s', id)
  debug('options: %O', options)

  const dependencies = await loadPackageDependencies('.', basedir, id =>
    /^((@noma\/plugin-[a-z0-9-]+)|(@[a-z0-9-_.]+\/noma-plugin-[a-z0-9-_.]+)|(noma-plugin-[a-z0-9-_.]+))$/.test(
      id
    )
  )

  // Config

  let config = {}
  let configSchema = {
    type: 'object',
    properties: {}
  }

  for (const dependency of dependencies) {
    const packageDir = await resolvePackageDir(dependency, basedir)
    const packageConfig = await loadConfig(packageDir, environment)
    const packageConfigSchema = await loadConfigSchema(packageDir)
    const packageShortName = getPackageShortName(dependency)
    const packageNamespace = packageShortName.split('.')

    config = mergeObjects(config, packageConfig)
    configSchema.properties[packageNamespace] = packageConfigSchema
  }

  const configDirs = getConfigDirs(id)

  for (const configDir of configDirs) {
    const dirConfig = await loadConfig(configDir, environment)
    const dirConfigSchema = await loadConfigSchema(configDir)

    config = mergeObjects(config, dirConfig)
    configSchema = mergeObjects(configSchema, dirConfigSchema)
  }

  const vars = {
    ...process.env
  }

  config = replaceValues(config, value => replaceVars(value, vars))

  function replaceVars (value, vars) {
    if (!isString(value)) {
      return value
    }

    const newValue = Mustache.render(value, vars)

    if (newValue === '') {
      return undefined
    }

    return newValue
  }

  debug(config)

  validateConfig(config, configSchema)

  // Execute

  const context = { basedir, config, debug, environment }

  for (const dependency of dependencies) {
    const _package = await loadModule(dependency, basedir)

    const packageShortName = getPackageShortName(dependency)

    const packageContext = {
      ...context,
      config: dotProp.get(config, packageShortName)
    }

    dotProp.set(context, packageShortName, await _package.default(packageContext))
  }

  const main = await loadModule(id, basedir)

  await main.default(context)

  return context
}

function getCurrentWorkingDirectory () {
  debug('getCurrentWorkingDirectory()')

  return process.cwd()
}

function getEnvironment () {
  debug('getEnvironment()')

  return process.env.APP_ENV || process.env.NODE_ENV || DEFAULT_ENV
}

function getPackageShortName (packageName) {
  debug('getPackageShortName("%s")', packageName)

  return packageName.replace(/^@[a-z0-9-_.]+\/(?:noma-)?plugin-([a-z0-9-_.]+)$/, '$1')
}
