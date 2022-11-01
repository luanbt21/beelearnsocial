import type { Record } from 'pocketbase'

interface IComment extends Record {
	postId?: string
	userId?: string
	content?: string
}
