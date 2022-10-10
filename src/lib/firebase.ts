import * as admin from 'firebase-admin'
import { PATH_TO_KEY } from '$env/static/private'

admin.initializeApp({
	credential: admin.credential.cert(PATH_TO_KEY),
})

export { admin }
