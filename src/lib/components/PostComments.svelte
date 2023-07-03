<script lang="ts">
	import { onMount } from 'svelte'
	import PostComment from './PostComment.svelte'
	import { user } from '$stores/auth'
	import { getUserId } from '$utils/client'
	import Tiptap from './Tiptap'
	import {
		getFirestore,
		collection,
		onSnapshot,
		query,
		where,
		addDoc,
		getDocs,
	} from 'firebase/firestore'
	import type { IComment } from '../../global'

	export let postId: string
	export let length = 0
	let comments: IComment & { id: string }[] = []
	$: length = comments.length

	let value = ''

	const collectionRef = collection(getFirestore(), 'comment')
	const q = query(collectionRef, where('postId', '==', postId))

	onSnapshot(q, {
		next: (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				const data = { ...(change.doc.data() as IComment), id: change.doc.id }
				switch (change.type) {
					case 'added':
						comments = [...comments, data]
						break
					case 'modified':
						comments = comments.map((r) => (r.id === data.id ? data : r))
						break
					case 'removed':
						comments = comments.filter((r) => r.id !== data.id)
						break

					default:
						break
				}
			})
		},
		error: (err) => {
			console.error(err)
		},
	})

	const sentComment = async () => {
		addDoc(collectionRef, {
			postId,
			userId: getUserId(),
			content: value,
		})
		value = ''
	}

	onMount(async () => {
		comments = await getDocs(q).then((snapshot) => {
			return snapshot.docs.map((doc) => {
				const data = doc.data() as IComment
				return {
					...data,
					id: doc.id,
				}
			})
		})
	})
</script>

{#if $user}
	<div class="flex items-start mt-5">
		<div class="avatar">
			<div class="w-11 rounded-full">
				<img src={$user.photoURL} alt="user avatar" />
			</div>
		</div>

		<div class="ml-3 w-full border-b">
			<div class="form-control">
				<div class="flex items-end">
					<div class="w-full">
						<Tiptap bind:value />
					</div>
					<button
						class="btn btn-square btn-sm lg:btn-md btn-secondary ml-2"
						on:click={sentComment}
						disabled={!value}
					>
						<img class="w-3/4" src="/sent-icon.svg" alt="sent" />
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#each comments as comment}
	<PostComment {comment} />
{/each}
