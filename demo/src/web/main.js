export default async function main({ config, debug, express }) {
  debug(config.web.message);

  const { app } = express;

  app.get('/', (req, res) => {
    debug('GET /');

    res.send('HELLO WORLD');
  });
}
