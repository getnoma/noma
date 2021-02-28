import { loadConfig } from '../src/index.js';

describe('@noma/cfg', () => {
  let cfg;

  describe('loadConfig', () => {
    let config;

    before('load config', async () => {
      config = await loadConfig('./', 'test');
    })
  });
});
