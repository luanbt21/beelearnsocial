import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { loadPosts } from './service'

export const load: PageServerLoad = async ({ locals, url }) => {
	const name = url.searchParams.get('name')
	if (!name) throw redirect(302, `/${locals.locale}/explore`)

	return {
		posts: await loadPosts({ tagName: name, user: locals.user }),
		tagName: name,
	}
}
