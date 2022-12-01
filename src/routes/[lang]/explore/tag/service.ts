import { isRepeating, getPosts } from '$lib/db/post'

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

	return await Promise.all(
		postsData.map(async (post) => ({
			...post,
			repeating: await isRepeating({
				userId: user?.id,
				postId: post.id,
			}),
		})),
	)
}
