const config = require('../index.js');

describe('config', () => {
  it('should extend standard', () => {
    expect(config).to.have.property('extends', 'standard');
  });
});
