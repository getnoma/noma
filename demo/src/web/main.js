export default async function main({ config, express }) {
  console.log(config.web.message);

  const { app } = express;

  app.get('/config', (req, res) => {
    res.json(config);
  });

  app.get('/', (req, res) => {
    res.send('HELLO WORLD');
  });
}
