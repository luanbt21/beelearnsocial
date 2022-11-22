import { createLearnLevel } from '$lib/db/learnLever'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ locals, request }) => {
	const data: { postId: string } = await request.json()
	if (!data.postId) throw error(400)
	if (!locals.user) throw error(401)

	const learnLevel = await createLearnLevel({ userId: locals.user.id, postId: data.postId })
	return json(learnLevel)
}
