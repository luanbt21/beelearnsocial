<script lang="ts">
	import { enhance } from '$app/forms'
	import LL, { locale } from '$i18n/i18n-svelte'
	import { showLoginModal, user } from '$stores/auth'
	import type { LocalizedString } from 'typesafe-i18n'

	export let action: string
	export let postId: string
	export let label: () => LocalizedString
	let isSending = false
</script>

<form
	method="POST"
	action={`/${$locale}/post?/${action}`}
	use:enhance={({ cancel }) => {
		if (!$user) {
			$showLoginModal = true
			cancel()
			return
		}
		isSending = true
		return async ({ update }) => {
			await update()
			isSending = false
		}
	}}
>
	<input type="hidden" name="postId" value={postId} />
	<button class="btn w-full btn-outline btn-error" disabled={isSending}>{label()}</button>
</form>
