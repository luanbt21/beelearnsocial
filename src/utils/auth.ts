import { getAuth } from 'firebase/auth'
import { invalidateAll } from '$app/navigation'

export const logout = async () => {
	await getAuth().signOut()
	invalidateAll()
}
