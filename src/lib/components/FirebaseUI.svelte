<script lang="ts">
	import {
		getAuth,
		GoogleAuthProvider,
		FacebookAuthProvider,
		TwitterAuthProvider,
		GithubAuthProvider,
		EmailAuthProvider,
	} from 'firebase/auth'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'

	let authComponent: HTMLElement

	onMount(async () => {
		console.log('mount auth ui')

		const firebaseui = await import('firebaseui')
		await import('firebaseui/dist/firebaseui.css')

		let ui = firebaseui.auth.AuthUI.getInstance()
		ui = ui ? ui : new firebaseui.auth.AuthUI(getAuth())
		ui.disableAutoSignIn()
		ui.start(authComponent, {
			signInFlow: 'popup',
			signInOptions: [
				{
					provider: GoogleAuthProvider.PROVIDER_ID,
					clientId: '808682107804-ctmcla1j4f3kcriqgnsacoivh2a1t5k4.apps.googleusercontent.com',
				},
				FacebookAuthProvider.PROVIDER_ID,
				TwitterAuthProvider.PROVIDER_ID,
				GithubAuthProvider.PROVIDER_ID,
				EmailAuthProvider.PROVIDER_ID,
			],
			credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
		})
	})
</script>

<label for="login" class="btn btn-ghost modal-button">Login</label>
<input type="checkbox" id="login" class="modal-toggle" />
<label for="login" class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<div bind:this={authComponent} />
	</label>
</label>
