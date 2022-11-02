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
	const items = await prisma.item.findMany({
		where: {
			sectionId: '6327403ab51aed39d050e03c',
		},
		include: {
			section: true,
		},
	})

	for (const item of items) {
		await prisma.post.create({
			data: {
				title: item.value,
				description: item.description || item.section.name,
				options: item.options,
				images: item.media ? [item.media] : undefined,
				author: {
					connect: {
						id: '6352be67d8f9d8dd456ef829',
					},
				},
				tags: {
					connect: {
						name: 'english',
					},
				},
			},
		})
	}
}

const images = async () => {
	const posts = await prisma.post.findMany({
		where: {
			authorId: '63535492213b9b0b33695147',
		},
	})
	for (const post of posts) {
		const [, url] = post.images[0].split('/https')
		if (url) {
			await prisma.post.update({
				where: { id: post.id },
				data: {
					images: {
						set: ['https' + url],
					},
				},
			})
		}
	}
}

const xx = async () => {
	const posts = await prisma.post.findMany({
		where: {
			authorId: '63535492213b9b0b33695147',
		},
	})
	for (const post of posts) {
		if (post.images[0].startsWith('://')) {
			await prisma.post.update({
				where: { id: post.id },
				data: {
					images: {
						set: ['https' + post.images[0]],
					},
				},
			})
		}
	}
}

main()
