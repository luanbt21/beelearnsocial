import { prisma } from '$lib/prisma'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
	const user = await prisma.user.findFirst({
		where: {
			id: params.id,
		},
	})
	return json(user, {
		headers: { 'Cache-Control': 'max-age=3600, must-revalidate' },
	})
}
