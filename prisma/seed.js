import { PrismaClient } from '@prisma/client'

async function main() {
	const prisma = new PrismaClient()
	const user = await prisma.user.create({
		data: {
			displayName: 'Luan',
			email: 'luan.vy.yb@gmail.com',
			isAnonymous: false,
			photoURL:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGfWfmEO79zsR9zg_Qeu1DR36KDElNr3jo-w&usqp=CAU',
			uid: '12345',
		},
	})
	console.log({ user })

	const tagsData = ['onthidaihoc', 'english']
	const tagsId = []
	for (const t of tagsData) {
		tagsId.push(
			await prisma.tag.upsert({
				where: {
					name: t,
				},
				update: {},
				create: {
					name: t,
					description: '',
				},
				select: {
					id: true,
				},
			}),
		)
	}
	console.log({ tags: tagsId })

	const post = await prisma.post.create({
		data: {
			authorId: user.id,
			title: 'Post title',
			caption: 'post caption',
			content: 'lorem ipsum bla bla bla',
			description: 'description',
			tags: {
				connect: tagsId,
			},
		},
		select: {
			id: true,
			tagIDs: true,
		},
	})

	console.log({ post })

	const reaction = await prisma.reaction.create({
		data: {
			userId: user.id,
			postId: post.id,
			type: 'LOVE',
			icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGfWfmEO79zsR9zg_Qeu1DR36KDElNr3jo-w&usqp=CAU',
		},
	})

	console.log({ reaction })

	for (const tagId of post.tagIDs) {
		await prisma.analytics.upsert({
			where: {
				reactionId: reaction.id,
				// tagId,
				// date: new Date().toLocaleDateString(),
			},
			update: {
				count: { increment: 1 },
			},
			create: {
				reactionId: reaction.id,
				tagId,
				date: new Date().toLocaleDateString(),
				count: 1,
			},
		})
	}
}

main()
