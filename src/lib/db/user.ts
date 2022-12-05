import { prisma } from '$lib/prisma'
import type { Locale } from '@prisma/client'
import type { DecodedIdToken } from 'firebase-admin/auth'

export const getUsers = async () => prisma.user.findMany()

export const saveUser = async (user: DecodedIdToken | void, locale: Locale) => {
	if (!user) return
	return await prisma.user.upsert({
		where: {
			uid: user.uid,
		},
		update: {
			uid: user.uid,
			displayName: user.name,
			photoURL: user.picture,
			locale,
		},
		create: {
			uid: user.uid,
			displayName: user.name,
			photoURL: user.picture,
			email: user.email,
			locale,
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

export const hidePost = async ({ userId, postId }: { userId?: string; postId?: string }) => {
	if (!userId || !postId) return
	return await prisma.user.update({
		where: { id: userId },
		data: {
			hiddenPostIDs: { push: postId },
		},
	})
}
