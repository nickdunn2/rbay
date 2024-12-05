import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id))

	return deserializeUser(id, user)
}

export const createUser = async (attrs: CreateUserAttrs) => {
	const userId = genId()

	await client.hSet(
		usersKey(userId),
		serializeUser(attrs)
	)

	return userId
}

export const serializeUser = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password,
	}
}

export const deserializeUser = (id: string, user: Record<string, string>) => {
	return {
		id,
		username: user.username,
		password: user.password,
	}
}
