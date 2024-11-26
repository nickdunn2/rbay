import { client } from '$services/redis'

const CachableRoutes: ReadonlyArray<string> = [
	'/about',
	'/privacy',
	'/auth/signin',
	'/auth/signup',
]

export const getCachedPage = (route: string) => {
	if (CachableRoutes.includes(route)) {
		return client.get(`pagecache#${route}`)
	}
	return null
}

export const setCachedPage = (route: string, page: string) => {
	if (CachableRoutes.includes(route)) {
		return client.set(`pagecache#${route}`, page, {
			EX: 2,
		})
	}
}
