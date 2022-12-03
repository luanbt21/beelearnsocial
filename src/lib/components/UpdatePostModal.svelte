<script lang="ts">
	import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
	import Tiptap from '$components/Tiptap'
	import CreateQuestion from '$components/CreateQuestion.svelte'
	import { locale, LL } from '$i18n/i18n-svelte'
	import { user } from '$stores/auth'
	import type { Option, Post } from '@prisma/client'
	import { enhance } from '$app/forms'
	import { toastError, toastSuccess } from '$utils/client'
	import type { ActionResult } from '@sveltejs/kit'

	export let id: string
	export let postId: string
	export let title: string
	export let description: string
	export let options: Option[]
	export let updateUI: (data: Pick<Post, 'title' | 'description' | 'options'>) => void

	let isQuestion = !!options.length
	let isQuestionOk = false
	let loading = false
	$: isFormOk = isQuestion ? title && description && isQuestionOk : title && description

	const handleSubmit = () => {
		loading = true
		return ({ result }: { result: ActionResult<Record<string, any>, Record<string, any>> }) => {
			if (result.type === 'success') {
				toastSuccess('Update post successfully')
				document.getElementById(id)?.click()
				updateUI(result.data as Pick<Post, 'title' | 'description' | 'options'>)
			} else {
				toastError('Update post failed')
				loading = false
			}
		}
	}
</script>

{#if $user}
	<div class="modal w-full">
		<div class="modal-box relative w-full max-w-4xl">
			<label for={id} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
			<h3 class="text-lg font-bold">{$LL.startAPost()}</h3>
			<div class="divider" />

			<div class="flex flex-col gap-y-2">
				<div class="flex items-center">
					<div class="avatar">
						<div class="w-12 rounded-full">
							<img src={$user.photoURL} alt="user avatar" />
						</div>
					</div>
					<div class="ml-2 w-full">
						<div class="font-semibold text-lg">
							{$user.displayName}
						</div>
					</div>
				</div>

				<div class="form-control w-full">
					<input
						form="update-post-form"
						type="text"
						name="title"
						placeholder={$LL.title()}
						class="input input-bordered w-full text-lg"
						maxlength="100"
						required
						bind:value={title}
					/>
				</div>

				<Tiptap bind:value={description} placeholder={$LL.startAPost()} className="min-h-16" />

				<form
					id="update-post-form"
					class="flex flex-col gap-y-2"
					action="/{$locale}/post?/update"
					method="POST"
					enctype="multipart/form-data"
					use:enhance={handleSubmit}
				>
					<input type="hidden" name="postId" value={postId} />
					<input type="hidden" name="description" value={description} />
					{#if isQuestion}
						<div class="relative border rounded-lg px-2 py-4">
							<button
								type="button"
								class="btn btn-sm btn-circle absolute right-2 top-2"
								on:click={() => (isQuestion = false)}
							>
								✕
							</button>
							<CreateQuestion bind:isQuestionOk {options} />
						</div>
					{/if}

					<div class="flex items-center flex-wrap justify-between mx-3">
						<div class="flex flex-wrap gap-x-2">
							{#if !isQuestion}
								<div class="tooltip" data-tip={$LL.addMultipleChoice()}>
									<button
										type="button"
										class="btn btn-ghost btn-square btn-sm"
										on:click={() => (isQuestion = true)}
									>
										<svg class="remix w-full h-full fill-current">
											<use href="{remixiconUrl}#ri-checkbox-multiple-fill" />
										</svg>
									</button>
								</div>
							{/if}
						</div>

						<button
							type="submit"
							class="btn btn-primary ml-auto"
							class:loading
							disabled={!isFormOk}
						>
							{$LL.update()}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
