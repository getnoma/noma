import { createDebug, enableDebug } from '../src/index.js'

describe('@noma/helper-debug', () => {
  describe('createDebug', () => {
    describe('when namespace argument is set', () => {
      it('should create a debug instance with set namespace', () => {
        const debug = createDebug('@noma/helper-debug/createDebug')
        expect(debug).to.have.property('namespace', '@noma/helper-debug/createDebug')
      })
    })

    describe('when namespace argument is not set', () => {
      it('should create a debug instance with package name as namespace', () => {
        const debug = createDebug()
        expect(debug).to.have.property('namespace', '@noma/helper-debug')
      })
    })
  })

  describe('enableDebug', () => {
    describe('when namespace argument is set', () => {
      it('should enable debug for set namespace', () => {
        const debug = createDebug('@noma/helper-debug/enableDebug')
        enableDebug('@noma/helper-debug/enableDebug')
        expect(debug).to.have.property('enabled', true)
      })
    })

    describe('when namespace argument is not set', () => {
      it('should enable debug for package name as namespace', () => {
        const debug = createDebug()
        enableDebug()
        expect(debug).to.have.property('enabled', true)
      })
    })
  })
})
