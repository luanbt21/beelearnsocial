import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function options() {
	const items = await prisma.item.findMany()
	for (const item of items) {
		await prisma.post.updateMany({
			where: {
				title: item.value,
			},
			data: {
				options: item.options,
			},
		})
	}
}

async function main() {
	const items = await prisma.item.findMany()
	const tag = await prisma.tag.findFirst({
		where: {
			name: 'english',
		},
	})

	const user = await prisma.user.findFirst()

	for (const item of items) {
		await prisma.post.create({
			data: {
				title: item.value,
				description: item.description,
				options: item.options,
				author: {
					connect: {
						id: user?.id,
					},
				},
				tags: {
					connect: {
						id: tag?.id,
					},
				},
			},
		})
	}
}

options()
