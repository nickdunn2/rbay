import { client } from '$services/redis'
import * as CacheKeyFunctions from '$services/keys'

const CachableRoutes: ReadonlyArray<string> = [
	'/about',
	'/privacy',
	'/auth/signin',
	'/auth/signup',
]

export const getCachedPage = (route: string) => {
	if (CachableRoutes.includes(route)) {
		return client.get(CacheKeyFunctions.pageCacheKey(route))
	}
	return null
}

export const setCachedPage = (route: string, page: string) => {
	if (CachableRoutes.includes(route)) {
		return client.set(CacheKeyFunctions.pageCacheKey(route), page, {
			EX: 2,
		})
	}
}
