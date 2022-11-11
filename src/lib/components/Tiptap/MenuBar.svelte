<script lang="ts">
	import MenuItem from './MenuItem.svelte'
	import type { Editor } from '@tiptap/core'

	export let editor: Editor

	let items = [
		{
			icon: 'bold',
			title: 'Bold',
			action: () => editor.chain().focus().toggleBold().run(),
			isActive: () => editor.isActive('bold'),
		},
		{
			icon: 'italic',
			title: 'Italic',
			action: () => editor.chain().focus().toggleItalic().run(),
			isActive: () => editor.isActive('italic'),
		},
		{
			icon: 'strikethrough',
			title: 'Strike',
			action: () => editor.chain().focus().toggleStrike().run(),
			isActive: () => editor.isActive('strike'),
		},
		{
			icon: 'code-view',
			title: 'Code',
			action: () => editor.chain().focus().toggleCode().run(),
			isActive: () => editor.isActive('code'),
		},
		{
			icon: 'mark-pen-line',
			title: 'Highlight',
			action: () => editor.chain().focus().toggleHighlight().run(),
			isActive: () => editor.isActive('highlight'),
		},
		{
			type: 'divider',
		},
		{
			icon: 'list-unordered',
			title: 'Bullet List',
			action: () => editor.chain().focus().toggleBulletList().run(),
			isActive: () => editor.isActive('bulletList'),
		},
		{
			icon: 'list-ordered',
			title: 'Ordered List',
			action: () => editor.chain().focus().toggleOrderedList().run(),
			isActive: () => editor.isActive('orderedList'),
		},
		{
			icon: 'code-box-line',
			title: 'Code Block',
			action: () => editor.chain().focus().toggleCodeBlock().run(),
			isActive: () => editor.isActive('codeBlock'),
		},
		{
			type: 'divider',
		},
		{
			icon: 'double-quotes-l',
			title: 'Blockquote',
			action: () => editor.chain().focus().toggleBlockquote().run(),
			isActive: () => editor.isActive('blockquote'),
		},
		{
			icon: 'separator',
			title: 'Horizontal Rule',
			action: () => editor.chain().focus().setHorizontalRule().run(),
		},
		{
			type: 'divider',
		},
		{
			icon: 'text-wrap',
			title: 'Hard Break',
			action: () => editor.chain().focus().setHardBreak().run(),
		},
		{
			icon: 'format-clear',
			title: 'Clear Format',
			action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
		},
		{
			type: 'divider',
		},
		{
			icon: 'arrow-go-back-line',
			title: 'Undo',
			action: () => editor.chain().focus().undo().run(),
		},
		{
			icon: 'arrow-go-forward-line',
			title: 'Redo',
			action: () => editor.chain().focus().redo().run(),
		},
	]
</script>

{#each items as item}
	{#if item.type === 'divider'}
		<div class="mx-2" />
	{:else if item.icon}
		<MenuItem {...item} />
	{/if}
{/each}
