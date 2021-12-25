import core from '@noma/core'
import commander from 'commander'

const { Command } = commander

async function main () {
	const program = new Command()

	program
		.version('1.0.0')
		.arguments('<id>', '.')
		.option('-c, --config <config>', 'config file to load')
		.option('-d, --debug', 'output debugging information', false)

		.action(async (id, { debug }) => {
			try {
				await core(id, { debug })
			} catch (err) {
				console.error(err)

				process.exit(1)
			}
		})

	await program.parseAsync(process.argv)
}

main()
