import { client } from '$services/redis';
import { itemsByViewsKey, itemsKey, itemsViewsKey } from '$services/keys';

/**
 * Increment view count for an item in BOTH the items hash and the items:views sorted set.
 *
 * TODO: Prevent same user from incrementing view count multiple times.
 */
export const incrementView = async (itemId: string, userId: string) => {
	const inserted = await client.pfAdd(itemsViewsKey(itemId), userId)

	if (inserted) {
		return Promise.all([
			client.hIncrBy(itemsKey(itemId), 'views', 1),
			client.zIncrBy(itemsByViewsKey(), 1, itemId),
		])
	}
}
