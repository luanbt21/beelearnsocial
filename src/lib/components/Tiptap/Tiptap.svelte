<script lang="ts">
	import CharacterCount from '@tiptap/extension-character-count'
	import Highlight from '@tiptap/extension-highlight'
	import Placeholder from '@tiptap/extension-placeholder'
	import Link from '@tiptap/extension-link'
	import StarterKit from '@tiptap/starter-kit'
	import { Editor } from '@tiptap/core'
	import { onDestroy, onMount } from 'svelte'
	import { LL } from '$i18n/i18n-svelte'
	import MenuBar from './MenuBar.svelte'

	export let className = ''
	export let value = ''
	export let placeholder = ''
	export let limit = 1000

	let element: Element
	let editor: Editor

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				StarterKit,
				Highlight,
				Placeholder.configure({
					emptyEditorClass: 'text-slate-500',
					placeholder,
				}),
				Link.configure({
					HTMLAttributes: {
						class: 'link link-neutral',
					},
				}),
				CharacterCount.configure({
					limit: 1000,
				}),
			],
			editorProps: {
				attributes: {
					class: 'break-all prose max-w-full m-2 focus:outline-none ' + className,
				},
			},
			content: value,
			onUpdate: ({ editor }) => {
				if (editor.getHTML() === '<p></p>') {
					value = ''
				} else {
					value = editor.getHTML()
				}
			},
			onTransaction: () => {
				editor = editor
			},
		})
	})

	onDestroy(() => {
		editor?.destroy()
	})
</script>

<div class="border-2 border-solid rounded-xl">
	{#if editor}
		<div class="flex flex-col m-2 max-h-[26rem] border-2 border-solid rounded-xl">
			<div class="flex items-center flex-initial flex-wrap p-1 border-b-2 border-solid">
				<MenuBar {editor} />
				<div class="text-slate-500 text-xs ml-auto">
					{editor.storage.characterCount.characters()}/{limit}
					| {editor.storage.characterCount.words()}
					{$LL.words()}
				</div>
			</div>
		</div>
	{/if}

	<div bind:this={element} />
</div>
