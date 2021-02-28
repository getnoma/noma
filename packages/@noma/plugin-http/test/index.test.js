import nomaPluginHttp from '../src/index.js';

describe('express', () => {
  let http;

  before('http', async () => {
    http = await nomaPluginHttp({ 
      config: {
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
      }
    });
  });

  describe('server', () => {
    it('should run on port 8080', () => {
      console.log(http.server)
      expect(http.server).to.have.property('port', 8080);
    });
  });

  describe('servers', () => {
    describe('default', () => {
      it('should run on port 8080', () => {
        expect(http.servers.default).to.have.property('port', 8080);
      });
    });

    describe('foo', () => {
      it('should run on port 8181', () => {
        expect(http.servers.foo).to.have.property('port', 8181);
      });
    });

    describe('bar', () => {
      it('should run on port 8282', () => {
        expect(http.servers.bar).to.have.property('port', 8282);
      });
    });
  })
});
