import '@noma/helper-env'

import { getConfigDirs, loadConfigDir, loadConfigDirSchema, validateConfig } from '@noma/helper-config'
import { createDebug, enableDebug } from '@noma/helper-debug'
import { loadModule } from '@noma/helper-modules'
import { isString, mergeObjects, replaceValues } from '@noma/helper-objects'
import { loadPackages, resolvePackageNameSync } from '@noma/helper-packages'
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
  const serviceName = resolvePackageNameSync(id, basedir)

  if (options.debug) {
    enableDebug()
  }

  debug('id: %s', id)
  debug('options: %O', options)

  const packages = await loadPackages(id, basedir, id =>
    /^((@noma\/plugin-[a-z0-9-_.]+)|(@[a-z0-9-_.]+\/noma-plugin-[a-z0-9-_.]+)|(noma-plugin-[a-z0-9-_.]+))$/.test(
      id
    )
  )

  debug('packages: %O', packages);

  // Config

  let config = {}
  let configSchema = {
    type: 'object',
    properties: {}
  }

  const packagesWithConfigPromises = packages.map(loadPackageConfig)
  const packagesWithConfig = await Promise.all(packagesWithConfigPromises)

  async function loadPackageConfig (packageObj) {
    let config = {}
    let configSchema = {
      type: 'object',
      properties: {}
    }
    
    const configDirs = getConfigDirs(packageObj.module.dir, packageObj.dir)

    for (const configDir of configDirs) {
      const dirConfig = await loadConfigDir(configDir, environment)
      const dirConfigSchema = await loadConfigDirSchema(configDir)
  
      config = mergeObjects(config, dirConfig)
      configSchema = mergeObjects(configSchema, dirConfigSchema)
    }

    return { ...packageObj, configDirs, config, configSchema }
  }

  debug('packagesWithConfig: %O', packagesWithConfig)

  return;

  const vars = {
    SERVICE_NAME: serviceName,
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

  validateConfig(config, configSchema)

  // Execute

  const baseContext = { basedir, config, debug, environment, serviceName }

  const dependenciesResult = {}

  for (const dependency of dependencies) {
    const _package = await loadModule(dependency, basedir)

    const packageShortName = getPackageShortName(dependency)

    const packageConfig = dotProp.get(config, packageShortName)

    const packageContext = {
      ...baseContext,
      ...dependenciesResult,
      config: packageConfig,
      debug: createDebug(packageShortName)
    }

    const packageResult = await _package.default(packageContext)

    dotProp.set(dependenciesResult, packageShortName, packageResult)
  }

  const main = await loadModule(id, basedir)

  const mainContext = {
    ...baseContext,
    ...dependenciesResult,
    debug: createDebug('main')
  }

  const mainResult = await main.default(mainContext)

  const context = {
    ...baseContext,
    ...dependenciesResult,
    ...mainResult
  }

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

async function execute ({ nodes, edges }) {
  const promises = {}
  const executors = {}

  for (const nodeId in nodes) {
    const { promise, executor } = newPromiseAndExecutor()

    promises[nodeId] = promise
    executors[nodeId] = executor
  }

  for (const nodeId in nodes) {
    const node = nodes[nodeId]
    const executor = executors[nodeId]

    all(Object.fromEntries(edges
      .filter(edge => edge[0] === nodeId)
      .map(edge => ([edge[1], promises[edge[1]]]))
    ))
    .then(context => node(context))
    .then(value => executor.resolve(value))
    .catch(error => executor.reject(error))
  }

  return all(promises)
}

async function all (promises) {
  const keys = Object.keys(promises)
  const values = Object.values(promises)

  return Promise
    .all(values)
    .then(values => keys
      .reduce((obj, key, idx) => ({
        ...obj,
        [key]: values[idx]
      }), {})
    )
}

function newPromiseAndExecutor () {
  let executor

  const promise = new Promise((resolve, reject) => {
    executor = { resolve, reject }
  })
  
  return {
    executor,
    promise
  }
}
