import http from 'http';

export default async function ({ config }) {
  if (!config) {
    return;
  }

  const servers = {};

  for (let serverId in config.servers) {
    const serverConfig = config.servers[serverId];

    servers[serverId] = createServer(serverConfig);
  }

  return { server: servers.default, servers };
}

function createServer(config) {
  const server = http.createServer();

  server.listen(config.port, () => {
    console.info(`Listening on http://localhost:${config.port}`);
  });

  return server;
}
