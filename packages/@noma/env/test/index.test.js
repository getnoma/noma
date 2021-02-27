import '../src/index.js';

describe('@noma/env', () => {
  it('should delete APP_ENV env var', () => {
    expect(process.env).to.not.have.property('APP_ENV');
  });

  it('should delete NODE_ENV env var', () => {
    expect(process.env).to.not.have.property('NODE_ENV');
  });

  it('should add env var TEST', () => {
    expect(process.env).to.have.property('TEST');
  });
});
