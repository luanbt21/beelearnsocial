import { readable, writable } from 'svelte/store'
import PocketBase from 'pocketbase'

export const pocket = readable(new PocketBase('https://pocket.beelearn.social'))

export const showCreatePostModal = writable(false)
