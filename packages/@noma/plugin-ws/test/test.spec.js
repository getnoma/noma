import nomaPluginWs from '../src/index.js';

async function main() {
  const ws = await nomaPluginWs({
    connections: {
      default: {
        connectionString: 'mongodb://localhost/test',
        collections: {
          foo: {
            indexes: [
              [
                {
                  foo: 1,
                },
                {
                  sparse: true,
                },
              ],
            ],
          },
        },
      },
    },
  });

  console.log(ws);
}

main();
