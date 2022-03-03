import { expect } from 'chai'
import { loadConfigDirs, getConfigDirs } from '../src/index.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const filename = fileURLToPath(import.meta.url)
const thisDir = dirname(filename)

const rootDir = path.join(thisDir, '../../../..')

describe('@noma/helper-config', () => {
	describe('when using getConfigDirs function', () => {
		let dirnames

		before(async () => {
			dirnames = getConfigDirs(thisDir, rootDir)
		})

		it('should return an array of all directory paths from the baseDir to the given dir', () => {
			expect(dirnames).to.eql([
				`${rootDir}/.noma`,
				`${rootDir}/packages/.noma`,
				`${rootDir}/packages/@noma/.noma`,
				`${rootDir}/packages/@noma/helper-config/.noma`,
				`${rootDir}/packages/@noma/helper-config/test/.noma`
			])
		})
	})

	describe('when using loadConfigDirs function', () => {
		let result

		before(async () => {
			const dirnames = getConfigDirs(thisDir, rootDir)
			result = await loadConfigDirs(dirnames, 'test')
		})

		it('should correctly merge all config files across all directories', () => {
			expect(result.config).to.eql({ bar: { a: 1, b: 2, c: 3, d: 4 } })
		})
	})
})
