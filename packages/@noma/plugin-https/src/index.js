import https from 'https'

export default async function ({ config }) {
	if (!config) {
		return
	}

	const servers = {}

	for (const serverId in config.servers) {
		const serverConfig = config.servers[serverId]

		servers[serverId] = createServer(serverConfig)
	}

	return { server: servers.default, servers }
}

function createServer ({ port, cert, key }) {
	const server = https.createServer({ cert, key })

	server.port = port

	server.listen(port, () => {
		console.info(`Listening on https://localhost:${port}`)
	})

	return server
}
