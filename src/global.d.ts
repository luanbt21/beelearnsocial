interface Timestamp {
	created: string
	updated: string
}
interface Comment extends Timestamp {
	id: string
	postId: string
	userId: string
	content: string
}
