import nomaPluginExpress from '../src/index.js';
import nomaPluginHttp from '@noma/plugin-http';

async function main() {
  const http = await nomaPluginHttp({
    servers: {
      default: {
        port: 8080,
      },
      foo: {
        port: 8181,
      },
      bar: {
        port: 8282,
      },
    },
  });

  const express = await nomaPluginExpress(
    {
      apps: {
        default: {
          server: 'default',
        },
        foo: {
          server: 'foo',
        },
        bar: {
          server: 'bar',
        },
      },
    },
    { http },
  );

  for (let appId in express.apps) {
    const app = express.apps[appId];

    app.get('/', hello(appId));
  }
}

main();

function hello(name) {
  return (req, res) => {
    res.send(`Hello ${name}`);
  };
}
