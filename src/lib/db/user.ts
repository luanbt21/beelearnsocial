import { prisma } from '$lib/prisma'
import type { DecodedIdToken } from 'firebase-admin/auth'

export const saveUser = async (user: DecodedIdToken | void) => {
	if (!user) return
	await prisma.user.upsert({
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
