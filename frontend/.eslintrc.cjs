module.exports = {
	env: {
		browser: true,
		es2021: true,
		jest: true,
	},
	extends: ['plugin:react/recommended', 'standard', 'prettier'],
	settings: {
		react: {
			version: 'detect',
		},
	},
	overrides: [],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['react', 'jest'],
	rules: {
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'warn',
	},
}
