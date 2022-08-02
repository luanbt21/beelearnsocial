<script lang="ts">
	import LL, { locale } from '$i18n/i18n-svelte';
	import LocaleSwitcher from '$components/LocaleSwitcher.svelte';
	import { loginWithGoogle } from '$utils/auth';

	let name = 'NONAME';
</script>

<header>
	<button on:click={loginWithGoogle}>login</button>
	<a href="{$locale}/about">About page</a> <br />
	<input type="text" bind:value={name} />
	<h1>Header {$LL.HI({ name })}</h1>
	<LocaleSwitcher />
</header>
