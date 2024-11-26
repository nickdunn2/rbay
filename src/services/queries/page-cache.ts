const CachableRoutes: ReadonlyArray<string> = [
	'/about',
	'/privacy',
	'/auth/signin',
	'/auth/signup',
]

export const getCachedPage = (route: string) => {};

export const setCachedPage = (route: string, page: string) => {};
