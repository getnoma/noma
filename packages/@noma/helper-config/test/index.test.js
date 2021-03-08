import { loadConfig } from '../src/index.js'

describe('@noma/helper-config', () => {
  describe('loadConfig', () => {
    before('load config', async () => {
      await loadConfig('./', 'test')
    })
  })
})
