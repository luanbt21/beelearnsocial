/**
 * Returns absolute paths to pages included in the modules
 *
 * @param url - import.meta.url
 * @param modules - import.meta.glob();
 * @returns Paths to pages excluding routes with dynamic parameters
 */
export const getPages = (url: string, modules: Record<string, unknown>) => {
	/*
	 * Possible url values
	 * Server: file:///____/src/routes/index.svelte
	 * Client(dev): http://127.0.0.1:____/src/routes/index.svelte?t=1658306082278
	 * Client(preview): http://127.0.0.1:____/_app/immutable/pages/index.svelte-e7ea94ef.js
	 */
	const directory = url
		.replace(/(.*?)\/src\/routes\//, '/')
		.replace(/(.*?)\/immutable\/pages\//, '/')
		.replace(/(.*?)\/var\/task\//, '/') // Vercel
		.replace(/\/([^/])*.svelte.*/, '/')

	const paths = Object.keys(modules)
		// Convert relative path to absolute path
		.map((path) => path.replace(/^(.\/)/, directory))
		// Filter private modules (default regular expression in SvelteKit)
		.filter((path) => !/(?:(?:^_|\/_)|(?:^\.|\/\.)(?!well-known))/.test(path))
		// Filter paths with dynamic parameters (e.g. /blog/[slug].svelte)
		.filter((path) => !/\[.*\]/.test(path))
		// Remove '/index', layout name (@___), and file extension (.svelte)
		.map((path) => path.replace(/(\/index)?(@.*)?.svelte/, ''))
		// Set empty path string to '/' ('./index.svelte' is converted to '')
		.map((path) => path || '/')
		.sort()

	return {
		directory,
		paths,
	}
}
