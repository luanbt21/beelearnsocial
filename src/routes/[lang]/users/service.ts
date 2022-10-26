import { prisma } from '$lib/prisma'

export const followUser = async ({ id, userId }: { id?: string; userId?: string }) => {
	if (!id || !userId) return
	return await prisma.user.update({
		where: { id },
		data: {
			following: {
				connect: {
					id: userId,
				},
			},
		},
	})
}

export const unfollowUser = async ({ id, userId }: { id?: string; userId?: string }) => {
	if (!id || !userId) return
	return await prisma.user.update({
		where: { id },
		data: {
			following: {
				disconnect: {
					id: userId,
				},
			},
		},
	})
}
