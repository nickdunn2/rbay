import { client } from '$services/redis'
import { itemsKey, userLikesKey } from '$services/keys'
import * as ItemsQueries from '$services/queries/items'

/**
 * Return boolean of whether a user likes an item.
 */
export const userLikesItem = async (itemId: string, userId: string) => {
	return client.sIsMember(userLikesKey(userId), itemId)
}

/**
 * Return array of items that a user likes.
 */
export const likedItems = async (userId: string) => {
	// Fetch all item ids that the user likes
	const itemIds = await client.sMembers(userLikesKey(userId))

	// Return array of the actual Item objects
	return ItemsQueries.getItems(itemIds)
}

/**
 * Like an item (for a user).
 * Also, increment the likes count for the item, if it's not already liked.
 */
export const likeItem = async (itemId: string, userId: string) => {
	const inserted = await client.sAdd(userLikesKey(userId), itemId)

	if (inserted) {
		return client.hIncrBy(itemsKey(itemId), 'likes', 1)
	}
}

/**
 * Unlike an item (for a user).
 * Also, decrement the likes count for the item, if it's not already unliked.
 */
export const unlikeItem = async (itemId: string, userId: string) => {
	const removed = await client.sRem(userLikesKey(userId), itemId)

	if (removed) {
		return client.hIncrBy(itemsKey(itemId), 'likes', -1)
	}
}

/**
 * Return array of items that two different users like.
 */
export const commonLikedItems = async (user1Id: string, user2Id: string) => {
	// Fetch intersection of item ids that both users like
	const itemIds = await client.sInter([userLikesKey(user1Id), userLikesKey(user2Id)])

	// Return array of the actual Item objects
	return ItemsQueries.getItems(itemIds)
}
