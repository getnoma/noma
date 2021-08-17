import { expect } from 'chai';
import noma from '@noma/core';

describe('worker', () => {
  let context

  before('init', async () => {
    context = await noma('demo/worker')
  })

  describe('context', () => {
    it('should have amqplib', () => {
      expect(context).to.have.property('amqplib')
    })

    it('should have basedir', () => {
      expect(context).to.have.property('basedir', process.cwd())
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

    it('should have packages', () => {
      expect(context).to.have.property('packages')
    })
  })
})