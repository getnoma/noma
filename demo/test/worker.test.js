import { expect } from 'chai';
import noma from '@noma/core';

describe('worker', () => {
  let context

  before('init', async () => {
    context = await noma('./src/worker/main.js')
  })

  describe('context', () => {
    it('should have amqplib', () => {
      expect(context).to.have.property('amqplib')
    })

    it('should have basedir', () => {
      expect(context).to.have.property('basedir', process.cwd())
    })

    it('should have config', () => {
      expect(context).to.have.property('config')
    })

    it('should have debug', () => {
      expect(context).to.have.property('debug')
    })

    it('should have environment', () => {
      expect(context).to.have.property('environment', 'test')
    })

    it('should have mongodb', () => {
      expect(context).to.have.property('mongodb')
    })

    it('should have serviceName', () => {
      expect(context).to.have.property('serviceName', 'demo')
    })
    
    it('should have worker', () => {
      expect(context).to.have.property('worker', true)
    })
  })
})