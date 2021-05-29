module.exports = {
	purge: ['./pages/**/*.{js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		colors: {
			primary: 'var(--primary)',
			secondaryPrimary: 'var(--secondaryPrimary)',
			secondaryPrimaryLight: 'var(--primaryLight)',
			secondary: 'var(--secondary)',
      secondaryDark: 'var(--secondaryDark)',
			highlight: 'var(--highlight)',
      highlightDark: 'var(--highlightDark)',
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
