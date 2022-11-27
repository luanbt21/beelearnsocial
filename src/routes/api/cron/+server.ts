import type { RequestHandler } from './$types'
import { prisma } from '$lib/prisma'
import { calculateSpaceTime } from '$utils'

export const PATCH: RequestHandler = async () => {
	const learnLevels = await prisma.learnLevel.findMany({
		where: {
			repeating: false,
		},
	})
	await Promise.all(
		learnLevels.map(async (learnLevel) => {
			const ms = calculateSpaceTime(learnLevel.level)
			const now = new Date().getTime()
			if (new Date(now - ms) >= learnLevel.updatedAt) {
				await prisma.learnLevel.update({
					where: {
						id: learnLevel.id,
					},
					data: {
						repeating: true,
						level: {
							increment: 1,
						},
					},
				})
			}
		}),
	).catch((e) => {
		console.log(new Date(), e)
	})

	return new Response()
}
