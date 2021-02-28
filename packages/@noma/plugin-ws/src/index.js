import WebSocket from 'ws'

export default async function ({ config, http }) {
  if (!config) {
    return
  }

  const servers = {}

  for (const serverName in config.servers) {
    const serverConfig = config.servers[serverName]
    const httpServer = http.servers[serverConfig.httpServer]

    servers[serverName] = new WebSocket.Server({ server: httpServer })
  }

  return servers
}
