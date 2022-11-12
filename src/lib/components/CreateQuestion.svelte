<script lang="ts">
	import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
	import { LL } from '$i18n/i18n-svelte'

	export let isQuestionOk: boolean

	let rightOption: string
	let options: { id: string; value: string; isDuplicated: boolean }[] = [
		{
			id: crypto.randomUUID(),
			value: '',
			isDuplicated: false,
		},
		{
			id: crypto.randomUUID(),
			value: '',
			isDuplicated: false,
		},
	]

	$: isQuestionOk =
		options.length > 0 &&
		!options.some((option) => !option.value || option.isDuplicated) &&
		!!rightOption

	const addOption = () => {
		options = [
			...options,
			{
				id: crypto.randomUUID(),
				value: '',
				isDuplicated: false,
			},
		]
	}

	let id: number
	const checkDuplicate = () => {
		if (id) clearTimeout(id)
		id = window.setTimeout(() => {
			out: for (let i = 0; i < options.length; i++) {
				let isDuplicated = false
				for (let j = 0; j < options.length; j++) {
					if (i === j) continue
					if (options[j].value === '') continue
					if (options[i].value === options[j].value) {
						options[i].isDuplicated = true
						options[j].isDuplicated = true
						continue out
					}
				}
				options[i].isDuplicated = isDuplicated
			}
		}, 100)
	}
</script>

<div class="flex flex-col gap-y-2">
	{#each options as option, i (option.id)}
		<div class="form-control">
			<div class="flex gap-x-2 items-end">
				<div class="w-full">
					<div class="flex align-baseline justify-between">
						<label class="label">
							<span class="label-text">Option {i + 1}</span>
						</label>

						{#if i >= 2}
							<button
								type="button"
								class="btn btn-ghost btn-sm normal-case"
								on:click={() => {
									options = options.filter((o) => o.id !== option.id)
								}}
							>
								{$LL.remove()}
							</button>
						{/if}
					</div>
					<input
						type="text"
						placeholder="..."
						class="input input-bordered w-full"
						class:input-error={option.isDuplicated}
						class:input-success={rightOption === option.value}
						name="option"
						bind:value={option.value}
						on:keyup={checkDuplicate}
					/>
				</div>
				<div>
					<div class="tooltip tooltip-left" data-tip={$LL.itIsRightOption()}>
						<label class="btn btn-sm md:btn-md btn-ghost btn-circle">
							<input
								type="radio"
								class="checkbox checkbox-success"
								name="rightOption"
								bind:group={rightOption}
								value={option.value}
								disabled={!option.value}
							/>
						</label>
					</div>
				</div>
			</div>
		</div>
	{/each}
	{#if options.length < 4}
		<button type="button" class="btn btn-outline btn-sm normal-case mt-4" on:click={addOption}>
			<svg class="remix w-5 h-5 fill-current">
				<use href={`${remixiconUrl}#ri-add-fill`} />
			</svg>
			<i class="ri-add-fill" />
			{$LL.addOption()}
		</button>
	{/if}
</div>
