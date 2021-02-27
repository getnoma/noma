import nomaPluginMongoDb from '../src/index.js';

async function main() {
  const mongodb = await nomaPluginMongoDb({
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

  console.log(mongodb);
}

main();
