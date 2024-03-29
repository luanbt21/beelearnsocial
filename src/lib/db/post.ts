import { postInclude } from '$lib/constant'
import { prisma } from '$lib/prisma'
import type { Option, Post, Prisma, Tag, User } from '@prisma/client'

export const isRepeating = async ({ userId, postId }: { userId?: string; postId: string }) => {
	if (!userId) return false

	return (await prisma.learnLevel.findFirst({
		where: {
			userId,
			postId,
		},
	}))
		? true
		: false
}

export const getPost = async (id: string) => {
	return prisma.post.findFirst({
		where: {
			id,
		},
		include: postInclude,
	})
}

export const getPosts = async ({
	where,
	page = 0,
	limit = 5,
}: {
	where?: Prisma.PostWhereInput
	page?: number
	limit?: number
}) => {
	return prisma.post.findMany({
		where,
		skip: page * limit,
		take: limit,
		orderBy: {
			createdAt: 'desc',
		},
		include: postInclude,
	})
}

export const deletePost = async (id: string) => {
	return prisma.post.delete({
		where: {
			id,
		},
	})
}

export interface PostRaw {
	_id: ID
	title: string
	description: string
	authorId: ID
	createdAt: Timestamp
	updatedAt: Timestamp
	options: Array<Option>
	tagIDs: Array<ID>
	audios: [string]
	videos: [string]
	images: [string]
}

export interface ID {
	$oid: string
}

export interface Timestamp {
	$date: string
}
export const searchPost = async ({
	q,
	page = 0,
	userId,
}: {
	q: string
	page?: number
	userId?: string
}): Promise<
	(Post & {
		author: User
		reactions: {
			userId: string
		}[]
		tags: Tag[]
		repeating: boolean
	})[]
> => {
	const postsRaw = (await prisma.post.findRaw({
		filter: {
			$text: { $search: q },
		},
		options: {
			skip: page * 5,
			limit: 5,
		},
	})) as unknown as PostRaw[]

	return await Promise.all(
		postsRaw.map(async (raw) => {
			const postId = raw._id.$oid
			const tagIDs = raw.tagIDs ? raw.tagIDs.map(({ $oid }) => $oid) : []
			return {
				id: postId,
				title: raw.title,
				description: raw.description,
				authorId: raw.authorId.$oid,
				author: (await prisma.user.findFirst({ where: { id: raw.authorId.$oid } })) as User,
				createdAt: new Date(raw.createdAt.$date),
				updatedAt: new Date(raw.updatedAt.$date),
				options: raw.options,
				tagIDs,
				tags: await prisma.tag.findMany({ where: { id: { in: tagIDs } } }),
				reactions: await prisma.reaction.findMany({
					where: { postId },
					select: { userId: true },
				}),
				audios: raw.audios || [],
				videos: raw.videos || [],
				images: raw.images || [],
				collectionIDs: [],
				repeating: await isRepeating({
					postId,
					userId,
				}),
			}
		}),
	)
}
