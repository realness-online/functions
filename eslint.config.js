export default [
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				console: 'readonly',
				process: 'readonly',
			},
		},
		rules: {
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'no-console': 'off',
			semi: ['error', 'never'],
			quotes: ['error', 'single'],
			'comma-dangle': ['error', 'es5'],
			'arrow-parens': ['error', 'as-needed'],
			camelcase: 'off',
		},
	},
]

