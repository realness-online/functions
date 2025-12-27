/* eslint-disable no-magic-numbers */
import globals from 'globals'

export default [
	{
		name: 'app/files-to-lint',
		files: ['**/*.js']
	},
	{
		name: 'app/files-to-ignore',
		ignores: ['**/coverage/**', 'artifacts/**']
	},
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.node
			}
		},
		rules: {
			'no-import-assign': 'off',
			camelcase: 'off',
			indent: 'off',
			'lines-between-class-members': 'off',
			curly: ['error', 'multi'],
			'no-console': [
				'error',
				{
					allow: ['warn', 'error', 'info', 'time', 'timeEnd', 'group', 'groupEnd']
				}
			],
			'no-debugger': 'error',
			'no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'prefer-const': 'error',
			'no-var': 'error',
			eqeqeq: ['error', 'always'],
			'no-multiple-empty-lines': ['error', { max: 1 }],
			'arrow-body-style': ['error', 'as-needed'],
			'no-param-reassign': 'error',
			'no-return-await': 'error',
			'require-await': 'error',
			'max-lines-per-function': ['warn', 200],
			complexity: ['warn', 30],
			'no-unsafe-optional-chaining': 'error',
			'no-constant-binary-expression': 'error',
			'no-unreachable-loop': 'error',
			'no-unused-private-class-members': 'error',
			'no-use-before-define': [
				'error',
				{
					functions: false,
					classes: true,
					variables: false,
					allowNamedExports: false
				}
			],
			'prefer-template': 'error',
			'prefer-destructuring': ['error', { array: true, object: true }],
			'prefer-rest-params': 'error',
			'prefer-spread': 'error',
			'no-array-constructor': 'error',
			'no-async-promise-executor': 'error',
			'no-promise-executor-return': 'error',
			'max-nested-callbacks': ['error', 5],
			'prefer-promise-reject-errors': 'error',
			'max-depth': ['error', 5],
			'max-params': ['error', 3],
			'no-magic-numbers': [
				'warn',
				{
					ignore: [-1, 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 50, 60, 70, 80, 90],
					enforceConst: true
				}
			],
			'no-nested-ternary': 'error',
			'arrow-spacing': ['error', { before: true, after: true }],
			'object-curly-spacing': ['error', 'always'],
			'array-bracket-spacing': ['error', 'never'],
			'no-else-return': 'error',
			'no-lonely-if': 'error',
			'no-unneeded-ternary': 'error',
			'no-useless-return': 'error',
			'no-floating-decimal': 'error',
			'object-shorthand': ['error', 'always'],
			'prefer-arrow-callback': 'error',
			'prefer-object-spread': 'error',
			'no-useless-computed-key': 'error',
			'no-template-curly-in-string': 'error',
			'require-atomic-updates': 'error',
			'no-await-in-loop': 'warn',
			'no-loss-of-precision': 'error',
			'comma-dangle': ['error', 'never'],
			'no-undef': 'error'
		}
	}
]
