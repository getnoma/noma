import { expect } from 'chai';
import noma from '@noma/core';

describe('web', () => {
  let context

  before('init', async () => {
    context = await noma('demo/web')
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

    it('should have express', () => {
      expect(context).to.have.property('express')
    })

    it('should have http', () => {
      expect(context).to.have.property('http')
    })

    it('should have mongodb', () => {
      expect(context).to.have.property('mongodb')
    })

    it('should have serviceName', () => {
      expect(context).to.have.property('serviceName', 'demo')
    })

    it('should have ws', () => {
      expect(context).to.have.property('ws')
    })
  })
})