import { PrismaClient } from '@prisma/client'

async function main() {
	const prisma = new PrismaClient()
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

main()
