const config = require('../index.js')

describe('@noma/eslint-config-noma', () => {
	it('should extend standard', () => {
		expect(config).to.have.property('extends', 'standard')
	})
})
