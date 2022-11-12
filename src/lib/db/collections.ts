import { prisma } from '$lib/prisma'
import type { Collection } from '@prisma/client'

export const getCollections = async (id: string) => {
	return await prisma.collection.findMany({
		where: {
			user: {
				id,
			},
		},
		include: {
			posts: {
				include: { author: true },
			},
		},
	})
}

export const saveCollection = async (collection: Collection) => {
	const c = await prisma.collection.findFirst({
		where: {
			name: collection.name,
			userId: collection.userId,
		},
	})
	if (!c) {
		return await prisma.collection.create({
			data: collection,
		})
	}
	return await prisma.collection.update({
		where: {
			id: c.id,
		},
		data: collection,
	})
}

export const deleteCollection = async (id: string) => {
	return await prisma.collection.delete({
		where: {
			id,
		},
	})
}
