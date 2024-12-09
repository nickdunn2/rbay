import type { CreateUserAttrs } from '$services/types'
import { genId } from '$services/utils'
import { client } from '$services/redis'
import { usernamesUniqueKey, usersKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {}

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id))

	return deserialize(id, user)
}

export const createUser = async (attrs: CreateUserAttrs) => {
	// See if the username is already taken
	const usernameExists = await client.sIsMember(usernamesUniqueKey(), attrs.username)
	if (usernameExists) {
		throw new Error('Username already taken!')
	}

	const userId = genId()

	await client.hSet(
		usersKey(userId),
		serialize(attrs)
	)
	// Add the username to the set of unique usernames
	await client.sAdd(usernamesUniqueKey(), attrs.username)

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
