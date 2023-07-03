<script lang="ts">
	import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
	import Tiptap from '$components/Tiptap'
	import CreateQuestion from '$components/CreateQuestion.svelte'
	import { locale, LL } from '$i18n/i18n-svelte'
	import { showLoginModal, user } from '$stores/auth'
	import { fileListToUrl } from '$utils'
	import PostMedia from './PostMedia.svelte'
	import InputTag from './InputTag.svelte'
	import type { LocalizedString } from 'typesafe-i18n'
	import { showCreatePostModal } from '$stores'
	import { toastError, toastSuccess, uploadMediaFile } from '$utils/client'
	import { deserialize } from '$app/forms'
	import { goto } from '$app/navigation'

	export let id: string

	if (!$user) {
		$showLoginModal = true
		$showCreatePostModal = false
	}

	const formId = 'create-post-form'

	let loading = false
	let title = ''
	let value = ''
	let addQuestion = false
	let isQuestionOk = false
	$: isFormOk = addQuestion ? title && value && isQuestionOk : title && value

	type Media = {
		audios?: FileList
		videos?: FileList
		images?: FileList
	}

	let mediaMenu: {
		dataTip: () => LocalizedString
		icon: string
		name: keyof Media
		accept: string
	}[] = [
		{
			dataTip: $LL.addImages,
			icon: 'image-2-fill',
			name: 'images',
			accept: 'image/*',
		},
		{
			dataTip: $LL.addAudios,
			icon: 'mv-fill',
			name: 'audios',
			accept: 'audio/*',
		},
		{
			dataTip: $LL.addVideos,
			icon: 'movie-fill',
			name: 'videos',
			accept: 'video/*',
		},
	]

	let media: Media = {}

	let mediaSrc: { audios: string[]; videos: string[]; images: string[] } = {
		audios: [],
		videos: [],
		images: [],
	}
	$: for (const [k, v] of Object.entries(media)) {
		mediaSrc[k as keyof Media] = fileListToUrl(v)
	}

	async function handleSubmit(event: SubmitEvent) {
		const form = event.target as HTMLFormElement
		const data = new FormData(form)
		loading = true

		try {
			await Promise.all(
				Object.entries(media).map(async ([k, v]) => {
					await Promise.all(
						Array.from(v).map(async (file) => {
							const url = await uploadMediaFile('media', file)
							data.append(k, url)
						}),
					)
				}),
			)

			const response = await fetch(form.action, {
				method: 'POST',
				credentials: 'include',
				body: data,
				headers: {
					'x-sveltekit-action': 'true',
				},
			})

			if (response.ok) {
				$showCreatePostModal = false
				const result = deserialize(await response.text())
				if (result.type === 'redirect') {
					goto(result.location)
				}
			} else {
				toastError($LL.failedTo({ st: $LL.post() }))
			}
		} catch (error) {
			toastError($LL.failedTo({ st: $LL.post() }))
		} finally {
			loading = false
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

				<form
					id={formId}
					class="flex flex-col gap-y-2"
					action="/{$locale}/post?/create"
					method="POST"
					on:submit|preventDefault={handleSubmit}
				>
					<fieldset disabled={loading}>
						<div class="form-control w-full">
							<input
								type="text"
								name="title"
								placeholder={$LL.title()}
								class="input input-bordered w-full text-lg"
								maxlength="100"
								required
								bind:value={title}
							/>
						</div>

						<Tiptap bind:value placeholder={$LL.startAPost()} className="min-h-16" />
						<input type="hidden" name="description" {value} />

						<PostMedia {...mediaSrc} />
						<InputTag />

						{#if addQuestion}
							<div class="relative border rounded-lg px-2 py-4">
								<button
									type="button"
									class="btn btn-sm btn-circle absolute right-2 top-2"
									on:click={() => (addQuestion = false)}
								>
									✕
								</button>
								<CreateQuestion bind:isQuestionOk />
							</div>
						{/if}
					</fieldset>
				</form>

				<div class="flex items-center flex-wrap justify-between mx-3">
					<div class="flex flex-wrap gap-x-2">
						{#each mediaMenu as item}
							<div class="tooltip" data-tip={item.dataTip()}>
								<label class="btn btn-ghost btn-square btn-sm" tabindex="0">
									<svg class="remix w-full h-full fill-current">
										<use href="{remixiconUrl}#ri-{item.icon}" />
									</svg>
									{media?.[item.name] ? media[item.name]?.length : ''}
									<input
										class="hidden"
										type="file"
										name={item.name}
										accept={item.accept}
										multiple
										bind:files={media[item.name]}
									/>
								</label>
							</div>
						{/each}

						<div class="tooltip" data-tip={$LL.addMultipleChoice()}>
							<button
								type="button"
								class="btn btn-ghost btn-square btn-sm"
								on:click={() => (addQuestion = true)}
							>
								<svg class="remix w-full h-full fill-current">
									<use href="{remixiconUrl}#ri-checkbox-multiple-fill" />
								</svg>
							</button>
						</div>
					</div>

					<button
						form={formId}
						type="submit"
						class="btn btn-primary ml-auto"
						class:loading
						disabled={!isFormOk}
					>
						{$LL.post()}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
