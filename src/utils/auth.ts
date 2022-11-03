import { getAuth } from 'firebase/auth'

export const logout = async () => {
	await getAuth().signOut()
}
