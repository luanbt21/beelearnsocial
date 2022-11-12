import { appendFile } from 'fs/promises'
import { join } from 'path'
import { likePost, dislikePost } from '$lib/db/reaction'
import { hidePost } from '$lib/db/user'
import { prisma } from '$lib/prisma'
import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { MEDIA_DIR_PATH, MEDIA_BASE_URL } from '$env/static/private'

const verifyId = async ({ locals, request }: { locals: App.Locals; request: Request }) => {
	if (!locals.user) {
		throw redirect(307, `/${locals.locale}/login`)
	}
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
	create: async ({ locals, request }) => {
		if (!locals.user) {
			throw redirect(307, `/${locals.locale}/login`)
		}
		const data = await request.formData()

		interface Media {
			images: string[]
			videos: string[]
			audios: string[]
			[key: string]: string[]
		}
		const media: Media = {
			images: [],
			videos: [],
			audios: [],
		}
		const options: { value: string; type: number }[] = []
		const rightOption = data.get('rightOption')

		for (const [k, v] of data.entries()) {
			if (k === 'option') {
				const value = v as string
				const type = v === rightOption ? 1 : 0
				options.push({ value, type })
				continue
			}
			if (k in media && v instanceof Blob && v.size !== 0) {
				const name = crypto.randomUUID() + v.name
				const data = Buffer.from(await v.arrayBuffer())
				await appendFile(join(MEDIA_DIR_PATH, name), data)
				media[k].push(MEDIA_BASE_URL + name)
				continue
			}
		}

		const post = await prisma.post.create({
			data: {
				title: data.get('title') as string,
				description: data.get('description') as string,
				author: {
					connect: {
						id: locals.user.id,
					},
				},
				tags: {
					connect: [],
				},
				...media,
				options,
			},
		})

		throw redirect(307, `/${locals.locale}/explore/post?id=${post.id}`)
	},
}
