<script lang="ts">
	import { goto } from '$app/navigation'
	import { user } from '$stores/auth'
	import { locale } from '$i18n/i18n-svelte'

	if ($user) {
		goto(`/${$locale}/profile/${$user.uid}`)
	} else {
		goto(`/${$locale}/login`)
	}
</script>
