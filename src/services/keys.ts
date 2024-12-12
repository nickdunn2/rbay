export const pageCacheKey = (id: string) => `pagecache#${id}`
export const sessionsKey = (sessionId: string) => `sessions#${sessionId}`

// Items
export const itemsKey = (itemId: string) => `items#${itemId}`
export const itemsByViewsKey = () => 'items:views'

// Users
export const usersKey = (userId: string) => `users#${userId}`
export const usernamesKey = () => 'usernames'
export const usernamesUniqueKey = () => 'usernames:unique'
export const userLikesKey = (userId: string) => `users:likes#${userId}`
