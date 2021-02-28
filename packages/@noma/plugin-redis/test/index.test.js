import nomaPluginRedis from '../src/index.js'

describe.skip('redis', () => {
  let redis

  before(async () => {
    redis = await nomaPluginRedis({
      config: {
        connections: {
          primary: {
            connectionString: 'redis://localhost'
          },
          secondary: {
            connectionString: 'redis://localhost'
          }
        }
      }
    })
  })

  it('should have a primary connection', () => {
    expect(redis.connections).to.have.property('primary')
  })

  it('should have a secondary connection', () => {
    expect(redis.connections).to.have.property('secondary')
  })
})
