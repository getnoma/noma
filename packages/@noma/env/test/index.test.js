import '../src/index.js'

describe('@noma/env', () => {
  it('should add env var TEST', () => {
    expect(process.env).to.have.property('TEST')
  })
})
