import '../src/index.js';

describe('env', () => {
  it('should env var TEST', () => {
    expect(process.env).to.have.property('TEST', 'YES');
  });
});
