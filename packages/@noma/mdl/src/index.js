import { createDebug } from '@noma/dbg';
import resolve from 'resolve';
import url from 'url';
import util from 'util';

const debug = createDebug();

const resolveAsync = util.promisify(resolve);

export async function loadModule(id, basedir) {
  debug('loadModule("%s", "%s")', id, basedir);

  const modulePath = await resolveModule(id, basedir);
  const { href } = url.pathToFileURL(modulePath);

  return import(href);
}

export async function resolveModule(id, basedir) {
  debug('resolveModule("%s", "%s")', id, basedir);

  return resolveAsync(id, { basedir });
}
