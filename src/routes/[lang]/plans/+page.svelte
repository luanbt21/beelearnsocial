<script lang="ts">
	import { enhance } from '$app/forms'
	import LL from '$i18n/i18n-svelte'
	import { fade } from 'svelte/transition'
	import type { PageData } from './$types'
	import TodoItem from '$components/TodoItem.svelte'
	import { authLoading, showLoginModal, user } from '$stores/auth'
	import { handleHideLoginModal } from '$utils/client'

	export let data: PageData

	$: if (!$authLoading && !$user) {
		$showLoginModal = true
	}

	$: handleHideLoginModal($showLoginModal, $user)
</script>

<svelte:head>
	<title>Plans</title>
</svelte:head>
<div in:fade class="p-4 flex flex-col gap-4">
	<div class="p-4 bg-base-100 rounded">
		<h2 class="mb-2">{$LL.whatDoYouWantToDo()}</h2>
		<form class=" flex flex-col gap-2" action="?/create" method="post" use:enhance>
			<div class="form-control">
				<label class="label" for="task-description">
					<span class="label-text">{$LL.taskDescription()}</span>
				</label>
				<input
					id="task-description"
					type="text"
					placeholder="..."
					name="description"
					class="input input-bordered"
					autocomplete="off"
					required
				/>
			</div>

			<!-- <div class="form-control">
				<label class="label" for="task-priority">
					<span class="label-text">{$LL.criticalLevel()}</span>
				</label>
				<input
					id="task-priority"
					type="text"
					placeholder="..."
					name="priority"
					class="input input-bordered"
					autocomplete="off"
				/>
			</div> -->

			<div>
				<label class="label" for="task-due">
					<span class="label-text">{$LL.dueDate()}</span>
				</label>
				<input
					id="task-due"
					type="date"
					name="due"
					min={new Date().toISOString().split('T')[0]}
					class="input input-bordered"
				/>
			</div>

			<button class="btn btn-sm normal-case">{$LL.addToList()}</button>
		</form>
	</div>

	{#if data.todoList}
		<div>
			<h1 class="text-lg font-semibold text-center">{$LL.todoList()}</h1>
			<div class="flex flex-col gap-4">
				{#each data.todoList as item (item.id)}
					<TodoItem {item} />
				{/each}
			</div>
		</div>
	{/if}

	{#if data.completedTodoList}
		<div>
			<h1 class="text-lg font-semibold text-center">{$LL.completedTodoList()}</h1>
			<div class="flex flex-col gap-4">
				{#each data.completedTodoList as item (item.id)}
					<TodoItem {item} />
				{/each}
			</div>
		</div>
	{/if}
</div>
