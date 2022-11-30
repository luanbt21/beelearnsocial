<script lang="ts">
	import { logout } from '$utils/auth'
	import { authLoading, user } from '$stores/auth'
	import LocaleSwitcher from '$components/LocaleSwitcher.svelte'
	import FirebaseUI from './FirebaseUI.svelte'
	import { CreatePostModalId } from '$lib/constant'
	import Pomodoro from './Pomodoro.svelte'

	type MenuItem = { icon: string; title: string; id: string }

	const titles = ['note', 'message', 'noti']

	const menu: MenuItem[] = titles.map((title) => ({
		title,
		icon: `/${title}-icon.svg`,
		id: title === 'note' ? CreatePostModalId : '',
	}))
</script>

<Pomodoro />
{#each menu as item}
	<label tabindex="0" for={item.id} class="btn btn-md btn-ghost btn-square" title={item.title}>
		<img class="w-5 md:w-6" src={item.icon} alt={item.title} />
	</label>
{/each}
<LocaleSwitcher />

{#if $authLoading}
	<button class="btn btn-square btn-ghost loading" />
{:else if !$user}
	<FirebaseUI />
{:else}
	<div class="dropdown dropdown-end">
		<label tabindex="0" class="btn btn-ghost btn-square rounded-btn normal-case">
			<img class="w-7" src={$user.photoURL} alt="avatar" />
		</label>
		<ul tabindex="0" class="menu dropdown-content p-2 shadow bg-base-100 rounded-box">
			<li><button on:click={logout}>logout</button></li>
		</ul>
	</div>
{/if}
