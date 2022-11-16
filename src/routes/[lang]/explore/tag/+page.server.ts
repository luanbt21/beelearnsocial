import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getPosts } from '$lib/db/post'

export const load: PageServerLoad = async ({ locals, url }) => {
	const name = url.searchParams.get('name')
	if (!name) throw redirect(302, `/${locals.locale}/explore`)

	return {
		posts: await getPosts({
			where: { tags: { some: { name } } },
		}),
		tagName: name,
	}
}
