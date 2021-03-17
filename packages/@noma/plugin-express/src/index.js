import express from 'express'

export default async function ({ config, http, https }) {
  if (!config) {
    return
  }

  const apps = {}

  for (const appId in config.apps) {
    const app = express()

    const servers = config.apps[appId].servers

    if (servers) {
      for (const serverId of servers) {
        const httpServer = http && http.servers && http.servers[serverId]
        const httpsServer = https && https.servers && https.servers[serverId]

        if (httpServer === undefined && httpsServer === undefined) {
          throw new Error('HTTP(S) Server Not Found')
        }

        if (httpServer) {
          httpServer.on('request', app)
        }

        if (httpsServer) {
          httpsServer.on('request', app)
        }
      }
    }

    apps[appId] = app
  }

  return { app: apps.default, apps }
}
