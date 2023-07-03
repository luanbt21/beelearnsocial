import { likePost, dislikePost } from '$lib/db/reaction'
import { hidePost } from '$lib/db/user'
import { prisma } from '$lib/prisma'
import { error, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { deletePost } from '$lib/db/post'

const verifyId = async ({ locals, request }: { locals: App.Locals; request: Request }) => {
	if (!locals.user) throw error(404)

	const data = await request.formData()
	const postId = <string>data.get('postId')
	return {
		userId: locals.user.id,
		postId,
	}
}

export const actions: Actions = {
	like: async ({ locals, request }) => {
		const params = await verifyId({ locals, request })
		return await likePost(params)
	},
	dislike: async ({ locals, request }) => {
		const params = await verifyId({ locals, request })
		return await dislikePost(params)
	},
	hide: async ({ locals, request }) => {
		const params = await verifyId({ locals, request })
		return await hidePost(params)
	},
	delete: async ({ locals, request }) => {
		const params = await verifyId({ locals, request })
		return await deletePost(params.postId)
	},
	update: async ({ locals, request }) => {
		if (!locals.user) throw error(404)
		const data = await request.formData()

		const { tags, ...validatedData } = validateData(data)
		const postId = data.get('postId') as string | null

		return await prisma.post.update({
			where: { id: postId || undefined },
			data: {
				...validatedData,
				tags: {
					connectOrCreate: tags.map((name) => ({
						where: { name },
						create: { name, description: '' },
					})),
				},
			},
			select: {
				title: true,
				description: true,
				options: true,
			},
		})
	},
	create: async ({ locals, request }) => {
		if (!locals.user) throw error(404)

		const data = await request.formData()
		const { tags, ...validatedData } = validateData(data)

		const post = await prisma.post.create({
			data: {
				...validatedData,
				author: { connect: { id: locals.user.id } },
				tags: {
					connectOrCreate: tags.map((name) => ({
						where: { name },
						create: { name, description: '' },
					})),
				},
			},
		})

		throw redirect(307, `/${locals.locale}/explore/post?id=${post.id}`)
	},
}

const validateData = (data: FormData) => {
	const title = data.get('title') as string | null
	if (!title) throw error(400, 'Title is empty')

	const description = data.get('description') as string | null
	if (!description) throw error(400, 'Description is empty')

	const options: { value: string; type: number }[] = []
	const rightOption = data.get('rightOption') as string | null

	type Media = 'images' | 'videos' | 'audios'
	const media: Record<Media, string[]> = {
		images: [],
		videos: [],
		audios: [],
	}
	const tags: string[] = []

	for (const [k, value] of data.entries()) {
		if (!value || typeof value !== 'string') {
			throw error(400, `Invalid value for ${k}`)
		}
		if (k === 'option') {
			const type = value === rightOption ? 1 : 0
			options.push({ value, type })
			continue
		}

		if (k === 'tag') {
			tags.push(value)
			continue
		}

		if (k in media) {
			media[k as Media].push(value)
			continue
		}
	}
	if (options.length === 1 || (options.length > 1 && !rightOption)) {
		throw error(400, 'Your question is not ok')
	}

	return {
		title,
		description,
		options,
		tags,
		...media,
	}
}
