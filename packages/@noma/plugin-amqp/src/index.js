import amqplib from 'amqplib';

export default async function ({ config }) {
  if (!config) {
    return;
  }
  
  let amqp = {
    connections: {},
  };

  const { connections } = config;

  if (connections) {
    for (const connectionId in connections) {
      const { connectionString } = connections[connectionId];

      const connection = await amqplib.connect(connectionString);

      amqp = {
        ...amqp,
        connections: {
          ...amqp.connections,
          [connectionId]: connection,
        },
      };
    }
  }

  const defaultConnection = amqp.connections && amqp.connections.default;

  if (defaultConnection) {
    amqp = {
      ...amqp,
      ...defaultConnection,
    };
  }

  return amqp;
}
