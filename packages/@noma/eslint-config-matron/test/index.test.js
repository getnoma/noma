const config = require('../index.js');

describe('config', () => {
  it('should extend @noma/noma', () => {
    expect(config).to.have.property('extends', '@noma/noma');
  });
});
