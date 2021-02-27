import { createDebug } from '@noma/dbg';
import { loadJsonFile } from '@noma/jsn';
import path from 'path';

const debug = createDebug();

try {
  var envPath = path.join(process.cwd(), 'env.json');
  var env = loadJsonFile(envPath);
  delete env.APP_ENV;
  delete env.NODE_ENV;

  Object.keys(env).forEach(key => {
    setProcessEnvVar(key, env[key]);
  });
} catch (err) {
  console.error('env.json not loaded');
}

function setProcessEnvVar(name, value) {
  debug('setProcessEnvVar("%s", "%s")', name, value);

  process.env[name] = value;
}
