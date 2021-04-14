export default async function main({ config, debug }) {
  debug(config.worker.message);
  debug('config: %O', config);

  return {
    worker: true
  }
}
