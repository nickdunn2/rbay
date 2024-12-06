import 'dotenv/config'
import { client } from '../src/services/redis'

const run = async () => {
	await client.hSet('car1', {
		color: 'red',
		year: 2001,
	})
	await client.hSet('car2', {
		color: 'blue',
		year: 2010,
	})
	await client.hSet('car3', {
		color: 'yellow',
		year: 2022,
	})

	const commands = [1,2,3].map(id => {
		return client.hGetAll(`car${id}`)
	})

	const results = await Promise.all(commands)

	console.log(results)
}

run()
