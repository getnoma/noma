import { loadConfigDir } from '../src/index.js'

describe('@noma/helper-config', () => {
	describe('loadConfigDir', () => {
		before('load config dir', async () => {
			await loadConfigDir('./', 'test')
		})
	})
})
