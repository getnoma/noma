import { createDebug } from '@noma/helper-debug'
import { mergeObjects } from '@noma/helper-objects'
import Ajv from 'ajv'
import fs from 'fs'
import jsonSchemaRefParser from 'json-schema-ref-parser'
import path from 'path'

const debug = createDebug()

export async function loadConfigDirs (dirs, environment) {
	const loadConfigDirPromises = dirs.map(dir => loadConfigDir(dir, environment))
	const configDirs = await Promise.all(loadConfigDirPromises)
	const configs = configDirs.map(({ config }) => config)
	const configSchemas = configDirs.map(({ configSchema }) => configSchema)
	const config = mergeObjects(...configs)
	const configSchema = mergeObjects(...configSchemas)

	return {
		config,
		configSchema
	}
}

export async function loadConfigDir (dir, environment) {
	debug('loadConfig("%s", "%s")', dir, environment)

	const configFiles = getConfigFiles(dir, environment)
	const configs = await Promise.all(configFiles.map(loadFile))
	const config = mergeObjects(...configs)

	const configSchemaFiles = getConfigSchemaFiles(dir)
	const configSchemas = await Promise.all(configSchemaFiles.map(loadFile))
	const configSchema = mergeObjects(...configSchemas)

	return { config, configSchema }
}

export function validateConfig (config, configSchema) {
	debug('validateConfig(%O, %O)', config, configSchema)

	const ajv = new Ajv({ $data: true, coerceTypes: true, allErrors: true, strictTuples: false, allowUnionTypes: true, useDefaults: true })
	const validate = ajv.compile(configSchema)

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

	const dirnames = [appendNomaFolder(dir)]

	let dirname = dir
	while (dirname !== basedir) {
		dirname = path.resolve(path.join(dirname, '..'))
		dirnames.push(appendNomaFolder(dirname))
	}

	return dirnames.reverse()
}

function appendNomaFolder (dirname) {
	return path.join(dirname, '.noma')
}

function getConfigSchemaFiles (dir) {
	const configSchemaFileNames = [
		path.join(dir, 'schema.json'),
		path.join(dir, 'schema.yml')
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
