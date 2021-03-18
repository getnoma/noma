import { connect } from 'amqplib'

export default async function ({ config }) {
  if (!config) {
    return
  }

  let amqplib = {
    connections: {}
  }

  const { connections } = config

  if (connections) {
    for (const connectionId in connections) {
      const { connectionString } = connections[connectionId]

      const connection = await connect(connectionString)

      amqplib = {
        ...amqplib,
        connections: {
          ...amqplib.connections,
          [connectionId]: connection
        }
      }
    }
  }

  const defaultConnection = amqplib.connections && amqplib.connections.default

  if (defaultConnection) {
    amqplib = {
      ...amqplib,
      connection: defaultConnection
    }
  }

  return amqplib
}
