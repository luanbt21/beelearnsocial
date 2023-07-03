import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { locale, LL } from '$i18n/i18n-svelte'
import { toast, type SvelteToastOptions } from '@zerodevx/svelte-toast'
import { getAuth, type User } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import type { Writable } from 'svelte/store'

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

export const toastSuccess = (msg: string, options?: SvelteToastOptions) => {
	toast.push(msg, {
		theme: {
			'--toastColor': 'mintcream',
			'--toastBackground': 'rgba(72,187,120,0.9)',
			'--toastBarBackground': '#2F855A',
		},
		...options,
	})
}

export const toastError = (msg?: string, options?: SvelteToastOptions) => {
	const theme = {
		'--toastColor': 'mintcream',
		'--toastBackground': 'rgba(248,114,114,0.9)',
		'--toastBarBackground': '#2F855A',
	}
	if (!msg) {
		LL.subscribe(({ somethingWentWrong }) => {
			toast.push(somethingWentWrong(), {
				theme,
				...options,
			})
		})
		return
	}
	toast.push(msg, {
		theme,
		...options,
	})
}

export const appGet = async (url: string) => {
	return fetch(url, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

export const appPost = async (url: string, body: Record<string, unknown>) => {
	return fetch(url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})
}

export const appFetch = async (
	url: URL | RequestInfo,
	method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
	body?: Record<string, unknown>,
	init?: RequestInit | undefined,
) => {
	return fetch(url, {
		method,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
		...init,
	})
}

// uploadMediaFile return the downloadURL of the uploaded file
export const uploadMediaFile = async (
	path: string,
	file: File,
	progress?: Writable<number>,
): Promise<string> => {
	if (!file.size) throw new Error(`File is empty: ${file.name}}`)
	const name = +file.name + crypto.randomUUID()
	const storageRef = ref(getStorage(), path + '/' + name)
	const uploadTask = uploadBytesResumable(storageRef, file)

	return new Promise((resolve, reject) => {
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				progress?.set((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
			},
			(error) => {
				reject(error)
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref)
					.then((downloadURL) => {
						resolve(downloadURL)
					})
					.catch((error) => {
						reject(error)
					})
			},
		)
	})
}
