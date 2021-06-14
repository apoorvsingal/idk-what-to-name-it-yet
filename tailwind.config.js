module.exports = {
	purge: ['./pages/**/*.{js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		colors: {
			primary: 'var(--primary)',
			primaryDark: 'var(--primaryDark)',
			secondary: 'var(--secondary)',
			secondaryDark: 'var(--secondaryDark)',
			secondaryPrimary: 'var(--secondaryPrimary)',
			secondaryPrimaryLight: 'var(--secondaryPrimaryLight)',
			secondaryPrimaryDark: 'var(--secondaryPrimaryDark)',
		},
		screens: {
			'sm': '480px',
			'md': '620px',
			'lg': '923px',
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
