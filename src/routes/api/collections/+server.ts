import { prisma } from '$lib/prisma'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) throw error(401)

	const data = await prisma.collection.findMany({
		where: {
			userId: locals.user.id,
		},
	})
	return json(data)
}

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) throw error(401)

	const data = (await request.json()) as {
		postId?: string
		collectionId?: string
		newCollectionName?: string
	}

	if (!data.postId) throw error(400)
	if (!data.collectionId && !data.newCollectionName) throw error(400)

	const posts = {
		connect: { id: data.postId },
	}

	const select = {
		id: true,
		name: true,
	}

	const collection = data.newCollectionName
		? await prisma.collection.create({
				data: {
					userId: locals.user.id,
					name: data.newCollectionName,
					description: '',
					posts,
				},
				select,
		  })
		: await prisma.collection.update({
				where: { id: data.collectionId },
				data: { posts },
				select,
		  })

	return json(collection)
}

export const PATCH: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) throw error(401)
	const data = (await request.json()) as {
		postId?: string
		collectionId?: string
	}
	if (!data.postId && !data.collectionId) throw error(400)

	await prisma.collection.update({
		where: { id: data.collectionId },
		data: {
			posts: {
				disconnect: { id: data.postId },
			},
		},
	})

	return new Response()
}
