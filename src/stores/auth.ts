import { readable, writable } from 'svelte/store'
import { getAuth, type User } from 'firebase/auth'
import { browser } from '$app/environment'
import { invalidateAll } from '$app/navigation'

export const showLoginModal = writable(false)

export const user = readable<User | null>(null, (set) => {
	getAuth().onAuthStateChanged(async (user) => {
		const token = await user?.getIdToken()
		set(user)
		showLoginModal.set(false)
		if (browser) {
			document.cookie = `token=${token ?? ''}; path=/`
			document.cookie = `userId=; path=/`
			invalidateAll()
		}
	})
})

export const authLoading = readable(true, (set) => {
	getAuth().onAuthStateChanged(() => {
		setTimeout(() => set(false))
	})
})
