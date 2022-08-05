const plugin = require('tailwindcss/plugin');

const rotateX = plugin(({ addUtilities }) => {
	addUtilities({
		'.rotate-y-180': {
			transform: 'rotateY(180deg)',
			'-webkit-transform': 'rotateY(180deg)',
			'-moz-transform': 'rotateY(180deg)'
		}
	});
});

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui'), rotateX]
};
