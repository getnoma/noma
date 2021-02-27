import { load } from '../src/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('cfg', () => {
  let cfg;

  before(async () => {
    cfg = await load('@noma/noma-config-test', process.cwd(), 'test');
  });

  it('should load .', () => {
    expect(cfg.env).to.eql('test')
  });
});
