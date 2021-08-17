import fs from 'fs'
import util from 'util'

const readFileAsync = util.promisify(fs.readFile)

export async function loadJsonFile (jsonFile) {
	const json = await readFileAsync(jsonFile, 'utf-8')
	const obj = JSON.parse(json)

	return obj
}
