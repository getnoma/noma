export default async function main({ config, debug }) {
  console.log(config.worker.message);

  debug('config: %O', config);
}
