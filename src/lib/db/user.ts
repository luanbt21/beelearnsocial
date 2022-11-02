import { prisma } from '$lib/prisma'
import type { DecodedIdToken } from 'firebase-admin/auth'

export const getUsers = async () => prisma.user.findMany()

export const saveUser = async (user: DecodedIdToken | void) => {
	if (!user) return
	return await prisma.user.upsert({
		where: {
			uid: user.uid,
		},
		update: {
			uid: user.uid,
			displayName: user.name,
			photoURL: user.picture,
		},
		create: {
			uid: user.uid,
			displayName: user.name,
			photoURL: user.picture,
			email: user.email,
		},
	})
}

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
