import { prisma } from '$lib/prisma'
import type { Post } from '@prisma/client'

export const savePost = async (post: Post) => {
	prisma.post.create({
		data: post,
	})
}

export const updatePost = async (post: Post) => {
	return prisma.post.update({
		where: {
			id: post.id,
		},
		data: post,
	})
}

export const deletePost = async (id: string) => {
	return await prisma.post.delete({
		where: {
			id,
		},
	})
}
