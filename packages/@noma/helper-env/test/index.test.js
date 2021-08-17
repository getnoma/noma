import '../src/index.js'

describe('@noma/helper-env', () => {
	it('should add env var TEST', () => {
		expect(process.env).to.have.property('TEST')
	})
})
