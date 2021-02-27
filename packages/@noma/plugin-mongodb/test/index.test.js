import nomaPluginMongoDb from '../src/index.js';

describe('mongodb', () => {
  let mongodb;

  before(async () => {
    mongodb = await nomaPluginMongoDb({
      connections: {
        primary: {
          connectionString: 'mongodb://localhost',
        },
        secondary: {
          connectionString: 'mongodb://localhost',
        },
      },
    });
  });

  it('should have a primary connection', () => {
    expect(mongodb.connections).to.have.property('primary');
  });

  it('should have a secondary connection', () => {
    expect(mongodb.connections).to.have.property('secondary');
  });
});
