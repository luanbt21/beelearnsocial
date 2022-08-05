<script lang="ts">
	import { loginWithGoogle, logout } from '$utils/auth';
	import { user } from '$stores/auth';
</script>

{#if !$user}
	<li><button class="btn" on:click={loginWithGoogle}>login</button></li>
{:else}
	<li><button class="btn" on:click={logout}>logout</button></li>
{/if}
<li><a>Navbar Item 2</a></li>
