import { loadConfig } from '../src/index.js'

describe('@noma/cfg', () => {
  describe('loadConfig', () => {
    before('load config', async () => {
      await loadConfig('./', 'test')
    })
  })
})
