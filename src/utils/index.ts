// e.g. /en/blog/article-1 => /de/blog/article-1
export const replaceLocaleInUrl = (path: string, locale: string): string => {
	const [, , ...rest] = path.split('/')
	return `/${[locale, ...rest].join('/')}`
}

export const fileListToUrl = (fileList?: FileList) => {
	if (!fileList) return []
	const urls = []
	for (const file of fileList) {
		urls.push(URL.createObjectURL(file))
	}
	return urls
}

/** Return space repetition time in mini seconds */
export const calculateSpaceTime = (level: number): number => {
	const day = 1
	if (level === 1) return 1 * day
	if (level === 2) return 6 * day
	const EF = 2.5
	return calculateSpaceTime(level - 1) * (EF + (level - 1) * 0.02)
}
