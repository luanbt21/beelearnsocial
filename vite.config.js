import { sveltekit } from '@sveltejs/kit/vite'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],

	optimizeDeps: {
		include: ['lodash.get', 'lodash.isequal', 'lodash.clonedeep'],
	},

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *;',
			},
		},
	},
}

export default config
