module.exports = {
	purge: ['./pages/**/*.{js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		colors: {
			darkBlue: 'var(--darkBlue)',
			purple: 'var(--purple)',
			darkPurple: 'var(--darkPurple)',
			red: 'var(--red)',
			lightRed: 'var(--lightRed)',
			orange: 'var(--orange)',
			white: 'var(--white)',
      lightGray: 'var(--lightGray)',
		}
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
