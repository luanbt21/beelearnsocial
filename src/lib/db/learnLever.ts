import { prisma } from '$lib/prisma'

export const createLearnLevel = async (arg: { userId: string; postId: string }) => {
	let learnLevel = await prisma.learnLevel.findFirst({ where: arg })
	if (!learnLevel) {
		learnLevel = await prisma.learnLevel.create({
			data: {
				...arg,
				level: 1,
			},
		})
	}
	return learnLevel
}
