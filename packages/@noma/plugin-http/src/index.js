import http from 'http'

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

function createServer (config) {
  const server = http.createServer()

  server.port = config.port

  server.listen(config.port, () => {
    console.info(`Listening on http://localhost:${config.port}`)
  })

  return server
}
