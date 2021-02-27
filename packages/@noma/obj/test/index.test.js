import chai from 'chai';

import { isString, replaceValues } from '../src/index.js';

const { expect } = chai;

describe('@noma/obj', () => {
  describe('replaceVars', () => {
    it('should replace values', () => {
      function replaceVars(value, vars) {
        if (!isString(value)) {
          return value;
        }

        return Object.keys(vars).reduce((value, varName) => {
          const varValue = vars[varName];
          const regex = new RegExp(`\\\${${varName}}`, 'gm');

          return value.replace(regex, varValue);
        }, value);
      }

      const actual = replaceValues(
        {
          foo: '${FOO}',
          bar: [
            {
              baz: '${BAZ}',
            },
          ],
          qox: {
            kax: '${KAX}',
          },
        },
        value =>
          replaceVars(value, {
            FOO: 'Foo',
            BAZ: 'Baz',
            KAX: 'Kax',
          }),
      );

      const expected = {
        foo: 'Foo',
        bar: [
          {
            baz: 'Baz',
          },
        ],
        qox: {
          kax: 'Kax',
        },
      };

      expect(actual).to.deep.equal(expected);
    });
  });
});
