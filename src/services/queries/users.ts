import type { CreateUserAttrs } from '$services/types'
import { genId } from '$services/utils'
import { client } from '$services/redis'
import { usernamesKey, usernamesUniqueKey, usersKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {
	const decimalId = await client.zScore(usernamesKey(), username)
	if (!decimalId) {
		throw new Error('User does not exist!')
	}

	// decimalId is a number, but we need to convert it back to a hex string
	const userId = decimalId.toString(16)

	return getUserById(userId)
}

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id))

	return deserialize(id, user)
}

export const createUser = async (attrs: CreateUserAttrs) => {
	// See if the username is already taken
	// TODO: Check the sorted set instead of the set, and remove the set
	const usernameExists = await client.sIsMember(usernamesUniqueKey(), attrs.username)
	if (usernameExists) {
		throw new Error('Username already taken!')
	}

	const userId = genId()

	await client.hSet(usersKey(userId), serialize(attrs))

	// Add the username to the set of unique usernames
	// TODO: remove this, because we're already adding the username to the sorted set
	await client.sAdd(usernamesUniqueKey(), attrs.username)
	// Also add the username + userId pair to a sorted set
	await client.zAdd(usernamesKey(), {
		value: attrs.username,
		score: parseInt(userId, 16), // <-- Convert userId hex string to a number
	})

	return userId
}

const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password,
	}
}

const deserialize = (id: string, user: Record<string, string>) => {
	return {
		id,
		username: user.username,
		password: user.password,
	}
}
