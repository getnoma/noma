import nomaPluginAmqp from '../src/index.js'

describe('amqp', () => {
  let amqp

  before(async () => {
    amqp = await nomaPluginAmqp({
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
    expect(amqp.connections).to.have.property('primary')
  })

  it('should have a secondary connection', () => {
    expect(amqp.connections).to.have.property('secondary')
  })
})
