import { prisma } from '$lib/prisma'

export const likePost = async ({ userId, postId }: { userId?: string; postId?: string }) => {
	if (!userId || !postId) return
	const reaction = await prisma.reaction.findFirst({ where: { userId, postId } })
	if (!reaction) {
		await prisma.reaction.create({
			data: { userId, postId },
			select: {
				postId: true,
				userId: true,
			},
		})
	}
}

export const dislikePost = async ({ userId, postId }: { userId?: string; postId?: string }) => {
	if (!userId || !userId) return
	await prisma.reaction.deleteMany({
		where: { postId, userId },
	})
}
