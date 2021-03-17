import nomaPluginExpress from '../src/index.js'
import nomaPluginHttp from '@noma/plugin-http'

describe('express', () => {
  let http, express

  before('http', async () => {
    http = await nomaPluginHttp({
      config: {
        servers: {
          default: {
            port: 8080
          },
          foo: {
            port: 8181
          },
          bar: {
            port: 8282
          }
        }
      }
    })
  })

  before('express', async () => {
    express = await nomaPluginExpress({
      config: {
        apps: {
          default: {
            servers: ['default', 'foo', 'bar']
          },
          foo: {
            servers: ['foo']
          },
          bar: {
            servers: ['bar']
          }
        }
      },
      http
    })

    express.apps.default.get('/', (req, res, next) => {
      res.set('X-App', 'default')

      next()
    })

    express.apps.foo.get('/', (req, res, next) => {
      res.set('X-App', 'foo')

      res.end()
    })

    express.apps.bar.get('/', (req, res, next) => {
      res.set('X-App', 'bar')

      res.end()
    })
  })

  describe('apps', () => {
    it('should have default app', () => {
      expect(express.apps).to.have.property('default')
    })

    it('should have foo app', () => {
      expect(express.apps).to.have.property('foo')
    })

    it('should have bar app', () => {
      expect(express.apps).to.have.property('bar')
    })
  })
})
