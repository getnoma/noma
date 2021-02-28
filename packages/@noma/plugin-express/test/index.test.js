import nomaPluginExpress from '../src/index.js';
import nomaPluginHttp from '@noma/plugin-http';

describe('express', () => {
  let http, express;

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
      },
    });
  });

  before('express', async () => {
    express = await nomaPluginExpress({
      config: {
        apps: {
          default: {
            server: 'default',
          },
          foo: {
            server: 'foo',
          },
          bar: {
            server: 'bar',
          },
        },
      },
      http,
    });
  });

  describe('apps', () => {
    it('should have default app', () => {
      expect(express.apps).to.have.property('default');
    });

    it('should have foo app', () => {
      expect(express.apps).to.have.property('foo');
    });

    it('should have bar app', () => {
      expect(express.apps).to.have.property('bar');
    });
  });
});
