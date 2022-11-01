import { readable } from 'svelte/store'
import PocketBase from 'pocketbase'

export const pocket = readable(new PocketBase('https://pocket.luanbt.live'))
