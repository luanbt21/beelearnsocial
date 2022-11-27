import { getPosts } from '$lib/db/post'
import { prisma } from '$lib/prisma'

export const loadPosts = async ({
	tagName,
	user,
	page = 0,
}: {
	tagName: string
	user?: User
	page?: number
}) => {
	const postsData = await getPosts({
		where: { tags: { some: { name: tagName } } },
		page,
	})

	const posts = user
		? await Promise.all(
				postsData.map(async (post) => {
					const repeating = (await prisma.learnLevel.findFirst({
						where: {
							userId: user?.id,
							postId: post.id,
						},
					}))
						? true
						: false

					return { ...post, repeating }
				}),
		  )
		: postsData.map((p) => ({ ...p, repeating: false }))

	return posts
}
