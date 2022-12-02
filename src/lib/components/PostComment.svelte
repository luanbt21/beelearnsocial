<script lang="ts">
	import { onMount } from 'svelte'
	import { locale } from '$i18n/i18n-svelte'
	import type { User } from '@prisma/client'
	import dayjs from 'dayjs'
	import type { IComment } from 'src/global'
	import { appGet } from '$utils/client'

	export let comment: IComment
	let user: User

	onMount(async () => {
		const res = await appGet(`/${$locale}/users/${comment.userId}`)
		user = await res.json()
	})
</script>

{#if user}
	<div class="flex items-start mt-3">
		<div class="avatar">
			<div class="w-11 rounded-full">
				<img src={user.photoURL} alt="user avatar" />
			</div>
		</div>
		<div class="ml-3 w-full">
			<div>
				<a class="link link-hover font-medium" href="{$locale}/profile/{user.uid}">
					{user.displayName}
				</a>
			</div>
			<article class="break-all">
				{@html comment.content}
			</article>
			<div class="flex w-full items-center justify-between">
				<div>
					<!-- <button class="btn btn-xs btn-ghost">Like</button> -->
				</div>
				<div>
					<span class="text-sm">
						{dayjs(comment.created).utc(true).fromNow()}
					</span>
				</div>
			</div>
		</div>
	</div>
{/if}
