<script lang="ts">
	import { loginWithGoogle, logout } from '$utils/auth'
	import { user } from '$stores/auth'

	type MenuItem = { icon: string; title: string }

	const titles = ['note', 'timer', 'message', 'noti']
	// const titles = ['note', 'timer']

	const menu: MenuItem[] = titles.map((title) => ({
		title,
		icon: `/${title}-icon.svg`,
	}))
</script>

{#each menu as item}
	<button class="btn btn-md btn-ghost btn-square" title={item.title}>
		<img class="w-8" src={item.icon} alt={item.title} />
	</button>
{/each}

{#if !$user}
	<button class="btn btn-ghost p-2" on:click={loginWithGoogle}>login</button>
{:else}
	<div class="dropdown dropdown-end">
		<button tabindex="0" class="btn btn-ghost btn-square rounded-btn">
			<img class="w-7" src={$user.photoURL} alt="user avatar" />
		</button>
		<ul class="menu dropdown-content p-2 shadow bg-base-100 rounded-box">
			<li><button on:click={logout}>logout</button></li>
		</ul>
	</div>
{/if}
