const config = require('../index.js');

describe('@noma/eslint-config-noma-test', () => {
  describe('extends', () => {
    it('should equal @noma/eslint-config-noma', () => {
      expect(config).to.have.property('extends', '@noma/eslint-config-noma');
    });
  });

  describe('env', () => {
    it('should have property mocha set to true', () => {
      expect(config.env).to.have.property('mocha', true);
    });
  });

  describe('globals', () => {
    it('should have property expect set to true', () => {
      expect(config.globals).to.have.property('expect', true);
    });
  });
});
