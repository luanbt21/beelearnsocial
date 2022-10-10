import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getAuth } from 'firebase-admin/auth'

import { app } from '$lib/firebase'
import { prisma } from '$lib/prisma'

export const load: PageServerLoad = async ({ cookies, locals: { locale } }) => {
	try {
		const token = cookies.get('token')
		if (!token) {
			throw redirect(307, `/${locale}/login`)
		}
		const { uid } = await getAuth(app).verifyIdToken(
			'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk5NjJmMDRmZWVkOTU0NWNlMjEzNGFiNTRjZWVmNTgxYWYyNGJhZmYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTHXDom4gQsO5aSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BSXRidm1tWnZ5X0lRX2N6aFdfUmFtSVlXdEc2aDV2bjI0VVg0eFlOME5xXz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9iYXlxdWFtb24iLCJhdWQiOiJiYXlxdWFtb24iLCJhdXRoX3RpbWUiOjE2NjUzOTYyODEsInVzZXJfaWQiOiJqckdlQzVLUGgzUkVyTUVhZU5NU1hZa0hMSUEyIiwic3ViIjoianJHZUM1S1BoM1JFck1FYWVOTVNYWWtITElBMiIsImlhdCI6MTY2NTM5NjI4MSwiZXhwIjoxNjY1Mzk5ODgxLCJlbWFpbCI6Imx1YW4udnkueWJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDI4NzI3MDUwODE1Mjg5NjM5MDIiXSwiZW1haWwiOlsibHVhbi52eS55YkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.DOi7Usu0Gg4V8765U6xf-gEFnSeplf05IUdaeQV0LiH2TPYvaVgghVZFHT55iPn86dDBgmx8Raal5iC_7t_8QxrHZfGH0Noe7YuHyXivItCvC2FphfaVBQ4lM0-SE5axZgqltckj24qLIMbQ6jJs9HkwJLMzR2epS0UOpoCMtBfFe8SdAH32L8OuXrBrGTg8wVxCkRP7-_Dc5KxhBCkiKF9K46xyxWcWhhphR9btHvZyKEwMM4sAJzdFuqHdEX1Xgl63aO9ol541EGG-mlpt4XGk8ASPHYHlzzhowIHK_LDl5eWTua_plv9Ra30BZmdx6K7zs7se7p6Wqxiio_ajZQ',
			true,
		)
		console.log(uid)

		return {
			user: prisma.user.findFirst({
				where: {
					uid: '12345',
				},
			}),
		}
	} catch (e) {
		console.log(e)

		throw redirect(307, `/${locale}/login`)
	}
}
