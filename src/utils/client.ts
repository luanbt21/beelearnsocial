import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { locale } from '$i18n/i18n-svelte'
import { getAuth, type User } from 'firebase/auth'

export const logout = async () => {
	await getAuth().signOut()
}

export const getUserId = () => {
	if (browser) {
		return document.cookie
			.split('; ')
			.find((row) => row.startsWith('userId='))
			?.split('=')[1]
	}
}

export const handleHideLoginModal = (showLoginModal: boolean, user?: User | null) => {
	if (!showLoginModal && !user && browser) {
		locale.subscribe((loc) => goto(`/${loc}/explore`))()
	}
}
