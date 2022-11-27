<script lang="ts">
	import { user } from '$stores/auth'
	import { locale, LL } from '$i18n/i18n-svelte'
	import { CreatePostModalId } from '$lib/constant'
</script>

{#if $user}
	<div class="mx-auto mb-4 px-4 py-6 overflow-hidden card shadow-md bg-base-100">
		<div class="flex items-center">
			<div class="avatar">
				<div class="w-12 rounded-full">
					<a href="/{$locale}/profile/{$user.uid}">
						<img src={$user.photoURL} alt="user avatar" />
					</a>
				</div>
			</div>
			<div class="ml-2 w-full">
				<label
					for={CreatePostModalId}
					class="block w-full hover:cursor-pointer outline outline-1 outline-stone-300 p-3 rounded-full font-medium"
				>
					{$LL.startAPost()}
				</label>
			</div>
		</div>
	</div>
{/if}
