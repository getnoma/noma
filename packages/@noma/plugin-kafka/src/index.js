import { Kafka } from 'kafkajs'

export default async function ({ config }) {
  if (!config) {
    return
  }

  const connections = {}

  for (const connectionId in config.connections) {
    const client = new Kafka(config.connections[connectionId])

    const consumer = client.consumer({ groupId: config.connections[connectionId].clientId })
    const producer = client.producer()

    await consumer.connect()
    await producer.connect()

    connections[connectionId] = { client, consumer, producer }
  }

  return { ...connections.default, connections }
}
