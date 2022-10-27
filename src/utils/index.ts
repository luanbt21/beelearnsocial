import { browser } from '$app/environment'

// e.g. /en/blog/article-1 => /de/blog/article-1
export const replaceLocaleInUrl = (path: string, locale: string): string => {
	const [, , ...rest] = path.split('/')
	return `/${[locale, ...rest].join('/')}`
}

export const getUserId = () => {
	if (browser) {
		return document.cookie
			.split('; ')
			.find((row) => row.startsWith('userId='))
			?.split('=')[1]
	}
}
