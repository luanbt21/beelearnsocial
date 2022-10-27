import { readable } from 'svelte/store'
import { getAuth, type User } from 'firebase/auth'
import { browser } from '$app/environment'

export const user = readable<User | null>(null, (set) => {
	getAuth().onAuthStateChanged(async (user) => {
		const token = await user?.getIdToken()
		if (browser) {
			document.cookie = `token=${token ?? ''}; path=/`
			document.cookie = `userId=; path=/`
		}
		set(user)
	})
})
