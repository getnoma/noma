import '@noma/env';

import { getConfigDirs, loadConfig, loadConfigSchema, validateConfig } from '@noma/cfg';
import { createDebug, enableDebug } from '@noma/dbg';
import { loadModule } from '@noma/mdl';
import { isString, mergeObjects, replaceValues } from '@noma/obj';
import { loadPackageDependencies, resolvePackageDir } from '@noma/pkg';

const DEFAULT_ENV = 'development';

const debug = createDebug();

export default async function (id = '.', options = {}) {
  const defaultOptions = {
    config: null,
    debug: false,
    plugins: ['*'],
    watch: false,
  };

  options = { ...defaultOptions, ...options };

  const basedir = getCurrentWorkingDirectory();
  const environment = getEnvironment();

  if (options.debug) {
    enableDebug();
  }

  debug('id: %s', id);
  debug('options: %O', options);

  const dependencies = await loadPackageDependencies('.', basedir, id =>
    /^((@noma\/plugin-[a-z0-9-]+)|(@[a-z0-9-]+\/noma-plugin-[a-z0-9-]+)|(noma-plugin-[a-z0-9-]+))$/.test(
      id,
    ),
  );

  // Config

  let config = {};
  let configSchema = {
    type: 'object',
    properties: {},
  };

  for (const dependency of dependencies) {
    const packageDir = await resolvePackageDir(dependency, basedir);
    const packageConfig = await loadConfig(packageDir, environment);
    const packageConfigSchema = await loadConfigSchema(packageDir);
    const packageShortName = getPackageShortName(dependency);
    config = mergeObjects(config, packageConfig);
    configSchema.properties[packageShortName] = packageConfigSchema;
  }

  const configDirs = getConfigDirs(id);

  for (const configDir of configDirs) {
    const dirConfig = await loadConfig(configDir, environment);
    const dirConfigSchema = await loadConfigSchema(configDir);

    config = mergeObjects(config, dirConfig);
    configSchema = mergeObjects(configSchema, dirConfigSchema);
  }

  const vars = {
    ...process.env,
  };

  config = replaceValues(config, value => replaceVars(value, vars));

  function replaceVars(value, vars) {
    if (!isString(value)) {
      return value;
    }

    return Object.keys(vars).reduce((value, varName) => {
      const varValue = vars[varName];
      const regex = new RegExp(`\\\$\{env\\.${varName}\}`, 'gm');

      return value.replace(regex, varValue);
    }, value);
  }

  validateConfig(config, configSchema);

  // Run

  const context = { basedir, config, debug, environment };

  for (const dependency of dependencies) {
    const _package = await loadModule(dependency, basedir);

    const packageShortName = getPackageShortName(dependency);

    const packageContext = {
      ...context,
      config: config[packageShortName],
    };

    context[packageShortName] = await _package.default(packageContext);
  }

  const main = await loadModule(id, basedir);

  await main.default(context);

  return context;
}

function getCurrentWorkingDirectory() {
  debug('getCurrentWorkingDirectory()');

  return process.cwd();
}

function getEnvironment() {
  debug('getEnvironment()');

  return process.env.APP_ENV || process.env.NODE_ENV || DEFAULT_ENV;
}

function getPackageShortName(packageName) {
  debug('getPackageShortName("%s")', packageName);

  return packageName.replace(/^@[a-z0-9-]+\/(?:noma-)?plugin-([a-z0-9-]+)$/, '$1');
}
