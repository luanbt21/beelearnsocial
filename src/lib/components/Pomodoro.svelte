<script lang="ts">
	import { browser } from '$app/environment'
	import LL from '$i18n/i18n-svelte'

	let isCounting = false

	let minuteInput: number | null = null
	const min = 0
	const max = 99
	$: {
		minuteInput = minuteInput ? (minuteInput = (minuteInput + max + 1) % (max + 1)) : null
	}

	let minute: number
	let second: number
	let percent: number
	let showCongratulation = false

	$: if (browser) {
		localStorage.setItem('showCongratulation', showCongratulation.toString())
	}

	const Due = 'Due'
	const MiniSec = 'MiniSec'

	const setup = () => {
		if (!minuteInput) return
		const miniSec = minuteInput * 60 * 1000
		const due = Date.now() + miniSec
		localStorage.setItem(Due, due.toString())
		localStorage.setItem(MiniSec, miniSec.toString())
	}

	if (browser) {
		window.setInterval(() => {
			showCongratulation = localStorage.getItem('showCongratulation') === 'true'
			const due = Number(localStorage.getItem(Due)) || 0
			if (!due) {
				isCounting = false
				return
			}

			isCounting = true
			const remaining = due - Date.now()

			const miniSec = Number(localStorage.getItem(MiniSec)) || 0
			percent = (remaining / miniSec) * 100

			minute = Math.floor(remaining / (60 * 1000))
			second = Math.floor(remaining / 1000) % 60
			if (second === 0 && minute === 0) {
				stop()
				showCongratulation = true
				return
			}
		}, 100)
	}

	const stop = () => {
		localStorage.removeItem(Due)
		localStorage.removeItem(MiniSec)
	}
</script>

{#if !isCounting}
	<div class="dropdown">
		<label
			tabindex="0"
			on:focus={() => (minuteInput = 0)}
			class="btn btn-md btn-ghost btn-square"
			title="Timer"
		>
			<img class="w-5 md:w-6" src="/timer-icon.svg" />
		</label>
		<div
			tabindex="0"
			class="flex flex-col justify-center gap-5 text-center dropdown-content p-2 shadow bg-base-100 rounded-box w-64 h-56 mt-4"
		>
			<h2 class="text-lg font-bold">Pomodoro</h2>
			<div class="flex justify-center align-middle gap-1">
				<button
					class="btn btn-square"
					on:click={() => (minuteInput = minuteInput ? minuteInput - 1 : -1)}
				>
					-
				</button>
				<input
					type="number"
					class="input input-bordered text-xl w-full max-w-xs text-center"
					{min}
					{max}
					bind:value={minuteInput}
				/>
				<button
					class="btn btn-square"
					on:click={() => (minuteInput = minuteInput ? minuteInput + 1 : +1)}
				>
					+
				</button>
			</div>

			<a class="btn rounded" on:click={setup}>{$LL.start()}</a>
		</div>
	</div>
{:else}
	<div class="dropdown">
		<div class="w-12">
			<label
				tabindex="0"
				class="radial-progress text-primary cursor-pointer"
				style="--value:{percent}; --size:3rem;"
			>
				{minute}:{second}
			</label>
		</div>
		<div tabindex="0" class="dropdown-content p-2 shadow bg-base-100 rounded-box mt-4">
			<a class="btn rounded btn-error" on:click={stop}>{$LL.stop()}</a>
		</div>
	</div>
{/if}

{#if showCongratulation}
	<input
		type="checkbox"
		id="pomodoro-modal"
		class="modal-toggle"
		bind:checked={showCongratulation}
	/>
	<div class="modal bg-base-300">
		<div class="modal-box">
			<h3 class="font-bold text-lg">{$LL.congratulation()}!</h3>
			<p class="py-4">
				{$LL.pomodoroReminder()}
			</p>
			<div class="modal-action">
				<label for="pomodoro-modal" class="btn">Yay!</label>
			</div>
		</div>
	</div>
{/if}
