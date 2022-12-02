import { postInclude } from '$lib/constant'
import { isRepeating } from '$lib/db/post'
import { prisma } from '$lib/prisma'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
	// if (!locals.user) throw error(401)

	const collection = await prisma.collection.findFirst({
		where: { id: params.id },
		select: {
			userId: true,
			name: true,
			posts: {
				include: postInclude,
			},
		},
	})
	if (!collection) throw error(404)
	// if (locals.user.id !== collection.userId) throw error(403)

	const posts = await Promise.all(
		collection.posts.map(async (post) => ({
			...post,
			repeating: await isRepeating({ userId: locals.user?.id, postId: post.id }),
		})),
	)
	return { name: collection.name, posts }
}
