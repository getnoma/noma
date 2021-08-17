import '@noma/helper-env'

import { getConfigDirs, loadConfigDirs, validateConfig } from '@noma/helper-config'
import { createDebug, enableDebug } from '@noma/helper-debug'
import { loadModule } from '@noma/helper-modules'
import { isString, mergeObjects, replaceValues } from '@noma/helper-objects'
import { loadPackages, sortPackages } from '@noma/helper-packages'
import Mustache from 'mustache'
import dotProp from 'dot-prop'

const DEFAULT_ENV = 'development'

const debug = createDebug()

export default async function (id = '.', options = {}) {
	const defaultOptions = {
		debug: false
	}

	options = { ...defaultOptions, ...options }

	const basedir = process.cwd()
	const environment = getEnvironment()

	if (options.debug) {
		enableDebug()
	}

	debug('id: %s', id)
	debug('basedir: %s', basedir)
	debug('options: %O', options)

	const dependencyFilter = id => /^((@noma\/plugin-[a-z0-9-_.]+)|(@[a-z0-9-_.]+\/noma-plugin-[a-z0-9-_.]+)|(noma-plugin-[a-z0-9-_.]+))$/.test(id)

	const packages = sortPackages(await loadPackages(id, basedir, dependencyFilter))

	// Service Name

	const serviceName = packages[0].name

	debug('serviceName: %O', serviceName)

	// Package Name Map

	const packageNameMap = packages.reduce((packageNameMap, packageObj) => {
		packageNameMap[packageObj.name] = packageObj

		return packageNameMap
	}, {})

	// Package Dependents

	const packageDependents = packages.reduce((dependents, packageObj) => {
		const packageDependencies = {
			[packageObj.name]: packageObj.version,
			...packageObj.dependencies,
			...packageObj.peerDependencies
		}

		for (const dependencyName in packageDependencies) {
			dependents[dependencyName] = dependents[dependencyName] || []
			dependents[dependencyName].push(packageObj.name)
		}

		return dependents
	}, {})

	for (const packageObj of packages) {
		const { name } = packageObj

		packageObj.dependents = packageDependents[name] || []
	}

	// Load Package Configs

	const packageConfigPromises = packages.reduce((packageConfigPromises, packageObj) => {
		const configDirs = getConfigDirs(packageObj.module.dir, packageObj.dir)

		packageConfigPromises[packageObj.name] = loadConfigDirs(configDirs, environment)

		return packageConfigPromises
	}, {})

	const packageConfigs = await all(packageConfigPromises)

	// Set Package Config Schemas

	for (const packageObj of packages) {
		const { name } = packageObj

		packageObj.configSchema = packageConfigs[name].configSchema
	}

	// Merge Package Configs

	for (const packageObj of packages) {
		const { namespace, dependents } = packageObj

		const configs = []

		for (const dependent of dependents) {
			const dependentConfig = packageConfigs[dependent]?.config

			const config = dotProp.get(dependentConfig, namespace)

			if (config !== undefined) {
				configs.push(config)
			}
		}

		configs.reverse()

		packageObj.config = mergeObjects(...configs)
	}

	// Replace Package Config Variables

	const vars = {
		SERVICE_NAME: serviceName,
		...process.env
	}

	for (const packageObj of packages) {
		packageObj.config = replaceValues(packageObj.config, value => replaceVars(value, vars))
	}

	// Validate Package Configs

	for (const packageObj of packages) {
		const { config, configSchema } = packageObj

		validateConfig(config, configSchema)
	}

	// Load Package Modules

	const packageModulePromises = packages.reduce((packageModulePromises, packageObj) => {
		packageModulePromises[packageObj.name] = loadModule(packageObj.module.file).then(module => module.default)

		return packageModulePromises
	}, {})

	const packageModules = await all(packageModulePromises)

	debug('packageModules: %O', packageModules)

	for (const packageObj of packages) {
		const { name } = packageObj

		packageObj.module.default = packageModules[name]
	}

	debug('packages: %O', packages)

	// Execute

	const nodes = packages.reduce((nodes, packageObj) => {
		const { name, config, module } = packageObj

		nodes[name] = async dependencies => {
			const packageContext = {
				basedir,
				config,
				debug: createDebug(name),
				environment,
				serviceName
			}

			for (const dependencyPackageName in dependencies) {
				const dependency = dependencies[dependencyPackageName]
				const dependencyPackage = packageNameMap[dependencyPackageName]

				dotProp.set(packageContext, dependencyPackage.namespace, dependency)
			}

			return module.default(packageContext)
		}

		return nodes
	}, {})

	const edges = packages.reduce((edges, packageObj) => {
		const { name, dependents } = packageObj

		for (const dependent of dependents) {
			if (dependent !== name) {
				edges.push([dependent, name])
			}
		}

		return edges
	}, [])

	const dependencies = await execute({ nodes, edges })

	const context = {
		basedir,
		environment,
		packages,
		serviceName
	}

	for (const dependencyPackageName in dependencies) {
		const dependency = dependencies[dependencyPackageName]
		const dependencyPackage = packageNameMap[dependencyPackageName]

		dotProp.set(context, dependencyPackage.namespace, dependency)
	}

	debug('context: %O', Object.keys(context))

	return context
}

function getEnvironment () {
	debug('getEnvironment()')

	return process.env.APP_ENV || process.env.NODE_ENV || DEFAULT_ENV
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
