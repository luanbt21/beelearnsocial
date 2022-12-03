<script lang="ts">
	import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
	import { LL } from '$i18n/i18n-svelte'
	import type { Option } from '@prisma/client'

	export let isQuestionOk: boolean
	export let options: Option[] | null = null

	let rightOption: string | undefined = options?.find(({ type }) => !!type)?.value

	const initOption = (value = '') => ({ id: crypto.randomUUID(), value, isDuplicated: false })

	let optionsInput: { id: string; value: string; isDuplicated: boolean }[] = options?.length
		? options.map(({ value }) => initOption(value))
		: [initOption(), initOption()]

	$: isQuestionOk =
		optionsInput.length > 0 &&
		!optionsInput.some((option) => !option.value || option.isDuplicated) &&
		!!rightOption

	const addOption = () => {
		optionsInput = [...optionsInput, initOption()]
	}

	let id: number
	const checkDuplicate = () => {
		if (id) clearTimeout(id)
		id = window.setTimeout(() => {
			out: for (let i = 0; i < optionsInput.length; i++) {
				let isDuplicated = false
				for (let j = 0; j < optionsInput.length; j++) {
					if (i === j) continue
					if (optionsInput[j].value === '') continue
					if (optionsInput[i].value === optionsInput[j].value) {
						optionsInput[i].isDuplicated = true
						optionsInput[j].isDuplicated = true
						continue out
					}
				}
				optionsInput[i].isDuplicated = isDuplicated
			}
		}, 100)
	}
</script>

<div class="flex flex-col gap-y-2">
	{#each optionsInput as option, i (option.id)}
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
									optionsInput = optionsInput.filter((o) => o.id !== option.id)
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
	{#if optionsInput.length < 4}
		<button type="button" class="btn btn-outline btn-sm normal-case mt-4" on:click={addOption}>
			<svg class="remix w-5 h-5 fill-current">
				<use href="{remixiconUrl}#ri-add-fill" />
			</svg>
			<i class="ri-add-fill" />
			{$LL.addOption()}
		</button>
	{/if}
</div>
