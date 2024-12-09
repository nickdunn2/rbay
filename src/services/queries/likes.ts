import { client } from '$services/redis'
import { itemsKey, userLikesKey } from '$services/keys'
import * as ItemsQueries from '$services/queries/items'

export const userLikesItem = async (itemId: string, userId: string) => {
	return client.sIsMember(userLikesKey(userId), itemId)
}

export const likedItems = async (userId: string) => {
	// Fetch all item ids that the user likes
	const itemIds = await client.sMembers(userLikesKey(userId))
	
	// Return array of the actual Item objects
	return ItemsQueries.getItems(itemIds)
}

export const likeItem = async (itemId: string, userId: string) => {
	const inserted = await client.sAdd(userLikesKey(userId), itemId)

	if (inserted) {
		return client.hIncrBy(itemsKey(itemId), 'likes', 1)
	}
}

export const unlikeItem = async (itemId: string, userId: string) => {
	const removed = await client.sRem(userLikesKey(userId), itemId)

	if (removed) {
		return client.hIncrBy(itemsKey(itemId), 'likes', -1)
	}
}

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {}
