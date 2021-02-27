import { createDebug, enableDebug } from '../src/index.js';

describe('@noma/dbg', () => {
  describe('createDebug', () => {
    describe('when namespace argument is set', () => {
      it('should create a debug instance with set namespace', () => {
        const debug = createDebug('@noma/dbg/createDebug');
        expect(debug).to.have.property('namespace', '@noma/dbg/createDebug');
      });
    });

    describe('when namespace argument is not set', () => {
      it('should create a debug instance with package name as namespace', () => {
        const debug = createDebug();
        expect(debug).to.have.property('namespace', '@noma/dbg');
      });
    });
  });

  describe('enableDebug', () => {
    describe('when namespace argument is set', () => {
      it('should enable debug for set namespace', () => {
        const debug = createDebug('@noma/dbg/enableDebug');
        enableDebug('@noma/dbg/enableDebug');
        expect(debug).to.have.property('enabled', true);
      });
    });

    describe('when namespace argument is not set', () => {
      it('should enable debug for package name as namespace', () => {
        const debug = createDebug();
        enableDebug();
        expect(debug).to.have.property('enabled', true);
      });
    });
  });
});
