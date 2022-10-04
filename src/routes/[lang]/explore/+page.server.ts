import type { PageServerLoad } from './$types'
import { prisma } from '$lib/prisma'

export const load: PageServerLoad = async () => {
	const tags = await prisma.analytics.findMany({
		where: {
			date: new Date().toLocaleDateString(),
		},
		orderBy: {
			count: 'asc',
		},
	})
	console.log(tags)
	return { tags }
}
