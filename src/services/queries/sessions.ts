import type { Session } from '$services/types';
import { client } from '$services/redis';
import { sessionsKey } from '$services/keys';

export const getSession = async (id: string) => {
	const session = await client.hGetAll(sessionsKey(id))

	if (Object.keys(session).length === 0) {
		return null
	}

	return deserialize(id, session)
}

export const saveSession = async (session: Session) => {}

export const deserialize = (id: string, session: Record<string, string>) => {
	return {
		id,
		userId: session.userId,
		username: session.username,
	}
}
