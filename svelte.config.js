import adapterAuto from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true,

			scss: {
				prependData: '@use "src/variables.scss" as *;',
			},
		}),
	],

	kit: {
		adapter: adapterAuto(),
		csrf: {
			checkOrigin: false,
		},
		alias: {
			'$i18n/*': 'src/i18n/*',
			$stores: 'src/stores/index.ts',
			'$stores/*': 'src/stores/*',
			$utils: 'src/utils/index.ts',
			'$utils/*': 'src/utils/*',
			$components: 'src/lib/components/index.ts',
			'$components/*': 'src/lib/components/*',
			$ui: 'src/lib/ui/index.ts',
			'$ui/*': 'src/lib/ui/*',
			$models: 'src/models/index.ts',
			'$models/*': 'src/models/*',
		},
	},
}

export default config
