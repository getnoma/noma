import lib from '@noma/lib';
import commander from 'commander';

const { Command } = commander;

async function main() {
  const program = new Command();

  program
    .version('1.0.0')
    .arguments('<id>', '.')
    .option('-c, --config <config>', 'config file to load')
    .option('-d, --debug', 'output debugging information', false)
    .option('-p, --plugins <plugins...>', 'plugins to load', '*')
    .option('-w, --watch', 'watch for changes', false)

    .action(async (id, { config, debug, plugins, watch }) => {
      try {
        await lib(id, { config, debug, plugins, watch });
      } catch (err) {
        console.error(err);
      }
    });

  await program.parseAsync(process.argv);
}

main();
