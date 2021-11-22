import mongodb from 'mongodb'

const { MongoClient } = mongodb

export default async function ({ config }) {
	if (!config) {
		return
	}

	let mongodb = {
		connections: {}
	}

	const { connections } = config

	if (connections) {
		for (const connection in connections) {
			const { collections, connectionString, useNewUrlParser, useUnifiedTopology } = connections[connection]

			const client = await MongoClient.connect(connectionString, {
				useNewUrlParser,
				useUnifiedTopology
			})

			const db = client.db()

			if (collections) {
				for (const collection in collections) {
					const { indexes, validator, validationAction, validationLevel } = collections[collection]

					for (const index of indexes || []) {
						const fields = index[0]
						const options = { ...(index[1] || {}), background: true }

						await db.collection(collection).createIndex(fields, options)
					}

					if (validator) {
						await db.command({
							collMod: collection,
							validator,
							validationAction,
							validationLevel
						})
					}
				}
			}

			mongodb = {
				...mongodb,
				connections: {
					...mongodb.connections,
					[connection]: { client, collections, connectionString, db }
				}
			}
		}
	}

	const defaultConnection = mongodb?.connections?.default

	if (defaultConnection) {
		mongodb = {
			...mongodb,
			...defaultConnection
		}
	}

	return mongodb
}
