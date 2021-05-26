module.exports = {
	purge: ['./pages/**/*.{js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		colors: {
			darkBlue: 'var(--darkBlue)',
			purple: 'var(--purple)',
			red: 'var(--red)',
			orange: 'var(--orange)',
			white: 'var(--white)',
		}
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
