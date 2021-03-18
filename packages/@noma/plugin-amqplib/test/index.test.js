import nomaPluginAmqplib from '../src/index.js'

describe('amqplib', () => {
  let amqplib

  before(async () => {
    amqplib = await nomaPluginAmqplib({
      config: {
        connections: {
          primary: {
            connectionString: 'amqp://localhost'
          },
          secondary: {
            connectionString: 'amqp://localhost'
          }
        }
      }
    })
  })

  it('should have a primary connection', () => {
    expect(amqplib.connections).to.have.property('primary')
  })

  it('should have a secondary connection', () => {
    expect(amqplib.connections).to.have.property('secondary')
  })
})
