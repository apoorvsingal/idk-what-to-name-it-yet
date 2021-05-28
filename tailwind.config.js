module.exports = {
	purge: ['./pages/**/*.{js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		colors: {
			white: 'var(--white)',
			snow: 'var(--snow)',
			lightPurple: 'var(--lightPurple)',		
			purple: 'var(--purple)',
      gray: 'var(--gray)',
			bg: 'var(--bg)',
      black: 'var(--black)',
    },
		screens: {
			'sm': '480px',
			'md': '620px',
			'lg': '923',
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
