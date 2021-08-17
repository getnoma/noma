// import '../src/index.js'

describe('@noma/cli', () => {
	before(async () => {
		try {
			const nodes = {
				foo: async ({ bar, baz }) => { console.info('foo', { bar, baz }); await delay(10); return 'Foo' },
				bar: async ({ qux }) => { console.info('bar', { qux }); await delay(1000); return 'Bar' },
				baz: async ({ qux }) => { console.info('baz', { qux }); await delay(1000); return 'Baz' },
				qux: async () => { console.info('qux', { }); await delay(2000); return 'Qux' }
			}

			const edges = [
				['foo', 'bar'],
				['foo', 'baz'],
				['bar', 'qux'],
				['baz', 'qux']
			]

			const context = await execute({ nodes, edges })

			console.info({ context })
		} catch (err) {
			console.error('Execution', err)
		}
	})

	it('should', () => {})
})

async function delay (ms) {
	return new Promise(resolve => {
		setTimeout(() => resolve(`Waited ${ms}ms`), ms)
	})
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
