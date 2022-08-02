import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$i18n: resolve('./src/i18n'),
			$stores: resolve(__dirname, './src/stores'),
			$components: resolve(__dirname, './src/lib/components'),
			$ui: resolve(__dirname, './src/lib/ui'),
			$models: resolve(__dirname, './src/models'),
			$utils: resolve(__dirname, './src/utils')
		}
	}
};

export default config;
