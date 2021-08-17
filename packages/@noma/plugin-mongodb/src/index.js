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
			const { connectionString, collections } = connections[connection]

			const client = await MongoClient.connect(connectionString, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			})

			const db = client.db()

			if (collections) {
				for (const collection in collections) {
					const { indexes, schema } = collections[collection]

					for (const index of indexes || []) {
						const fields = index[0]
						const options = { ...(index[1] || {}), background: true }

						await db.collection(collection).createIndex(fields, options)
					}

					if (schema) {
						await db.command({
							collMod: collection,
							validator: {
								$jsonSchema: schema
							},
							validationLevel: 'strict'
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

	const defaultConnection = mongodb.connections && mongodb.connections.default

	if (defaultConnection) {
		mongodb = {
			...mongodb,
			...defaultConnection
		}
	}

	return mongodb
}
