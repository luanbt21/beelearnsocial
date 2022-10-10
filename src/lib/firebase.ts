import { initializeApp, credential } from 'firebase-admin'
import { PATH_TO_KEY } from '$env/static/private'

export const app = initializeApp({
	credential: credential.cert(PATH_TO_KEY),
})
