export default async function main({ config, debug, express }) {
  console.info(config.web.message)

  const { app } = express;

  app.get('/', (req, res) => {
    debug('GET /');

    res.send('HELLO WORLD');
  });

  return {
    web: true
  }
}
