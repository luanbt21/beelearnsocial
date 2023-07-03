// import { appendFile } from 'fs/promises'
// import { join } from 'path'
// import { MEDIA_DIR_PATH, MEDIA_BASE_URL } from '$env/static/private'

// export const saveMediaFile = async ({ blob }: { blob: Blob }) => {
// 	if (blob.size === 0) throw new Error('File is empty')
// 	const name = crypto.randomUUID() + blob.name
// 	const data = Buffer.from(await blob.arrayBuffer())
// 	await appendFile(join(MEDIA_DIR_PATH, name), data)
// 	return MEDIA_BASE_URL + name
// }
