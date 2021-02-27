import express from 'express';

export default async function ({ config, http }) {
  if (!config) {
    return;
  }

  const apps = {};

  for (let appId in config.apps) {
    const serverId = config.apps[appId].server;

    const server = http.servers[serverId];

    if (!server) {
      throw new Error('Server Not Found');
    }

    const app = express();

    server.on('request', app);

    apps[appId] = app;
  }

  return { app: apps.default, apps };
}
