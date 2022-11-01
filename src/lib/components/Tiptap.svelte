<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { Editor } from '@tiptap/core'
	import StarterKit from '@tiptap/starter-kit'
	import { LL } from '$i18n/i18n-svelte'

	export let value = ''
	export let placeHolder = 'comment'

	let element: Element
	let editor: Editor

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit],
			editorProps: {
				attributes: {
					class: 'm-2 focus:outline-none break-all',
					placeHolder,
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
		if (editor) {
			editor.destroy()
		}
	})
</script>

{#if editor}
	<div class="m-2 border-y-2 w-fit ">
		<!-- <button
			class="btn btn-ghost btn-xs"
			on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
			class:btn-active={editor.isActive('heading', { level: 4 })}
		>
			{$LL.title()}
		</button> -->

		<!-- <button
			class="btn btn-ghost btn-xs"
			on:click={() => editor.chain().focus().setParagraph().run()}
			class:btn-active={editor.isActive('paragraph')}
		>
			P
		</button> -->
		<button
			class="btn btn-ghost btn-xs"
			on:click={() => editor.chain().focus().toggleBold().run()}
			class:btn-active={editor.isActive('bold')}
		>
			{$LL.bold()}
		</button>
		<button
			class="btn btn-ghost btn-xs"
			on:click={() => editor.chain().focus().toggleItalic().run()}
			class:btn-active={editor.isActive('italic')}
		>
			{$LL.italic()}
		</button>
		<button
			class="btn btn-ghost btn-xs"
			on:click={() => editor.chain().focus().toggleStrike().run()}
			class:btn-active={editor.isActive('strike')}
		>
			{$LL.strike()}
		</button>
		<button
			class="btn btn-ghost btn-xs"
			on:click={() => editor.chain().focus().toggleCode().run()}
			class:btn-active={editor.isActive('code')}
		>
			code
		</button>
	</div>
{/if}

<div bind:this={element} />
