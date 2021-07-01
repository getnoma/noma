import { createDebug } from '@noma/helper-debug'
import { mergeObjects } from '@noma/helper-objects'
import Ajv from 'ajv'
import fs from 'fs'
import jsonSchemaRefParser from 'json-schema-ref-parser'
import path from 'path'

const debug = createDebug()

export async function loadConfigDir (dir, environment) {
  debug('loadConfig("%s", "%s")', dir, environment)

  const configFiles = getConfigFiles(dir, environment)
  const configs = await Promise.all(configFiles.map(loadFile))
  const config = mergeObjects(...configs)

  debug('loadConfig:configFiles %O', configFiles)
  debug('loadConfig:configs %O', configs)

  return config
}

export async function loadConfigDirSchema (dir) {
  debug('loadConfigSchema("%s", "%s")', dir)

  const configSchemaFiles = getConfigSchemaFiles(dir)
  const configSchemas = await Promise.all(configSchemaFiles.map(loadFile))
  const configSchema = mergeObjects(...configSchemas)

  return configSchema
}

export function validateConfig (config, configSchema) {
  debug('validateConfig(%O, %O)', config, configSchema)

  var ajv = new Ajv({ $data: true, coerceTypes: true, allErrors: true, nullable: true, useDefaults: true })
  var validate = ajv.compile(configSchema)

  if (validate(config)) {
    return true
  } else {
    throw new ConfigValidationError(validate.errors)
  }
}

async function loadFile (file) {
  debug('loadFile: %s', file)

  if (!fs.existsSync(file)) {
    return
  }

  const absolutePathToConfigFile = path.resolve(file)

  return jsonSchemaRefParser.dereference(absolutePathToConfigFile)
}

function getConfigFiles (dir, environment) {
  debug('getConfigFiles("%s", "%s")', dir, environment)

  const configFileNames = [
    path.join(dir, 'default.json'),
    path.join(dir, 'default.yml'),
    path.join(dir, `${environment}.json`),
    path.join(dir, `${environment}.yml`)
  ]

  return configFileNames
}

export function getConfigDirs (dir, basedir) {
  debug('getConfigDirs("%s, %s")', dir, basedir)

  let dirname = dir
  const dirnames = []

  while (true) {
    dirnames.push(path.join(dirname, '.noma'))
    dirname = path.resolve(path.join(dirname, '..'))

    if (dirname !== basedir) {
      break;
    }
  }

  return dirnames.reverse()
}

function getConfigSchemaFiles (dir) {
  const configDir = path.join(dir, '.noma')

  const configSchemaFileNames = [
    path.join(configDir, 'schema.json'),
    path.join(configDir, 'schema.yml')
  ]

  return configSchemaFileNames
}

class ConfigValidationError extends Error {
  constructor (validationErrors) {
    super('Error validating config')
    this.code = 'CONFIG_VALIDATION_ERROR'
    this.validationErrors = validationErrors
  }
}
