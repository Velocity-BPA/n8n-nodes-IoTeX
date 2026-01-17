/**
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	root: true,

	env: {
		browser: false,
		es6: true,
		node: true,
	},

	parser: '@typescript-eslint/parser',

	parserOptions: {
		project: ['./tsconfig.json'],
		sourceType: 'module',
		extraFileExtensions: ['.json'],
	},

	ignorePatterns: [
		'.eslintrc.js',
		'.eslintrc.prepublish.js',
		'gulpfile.js',
		'node_modules/**',
		'dist/**',
	],

	plugins: ['@typescript-eslint', 'n8n-nodes-base'],

	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/nodes',
	],

	rules: {
		// TypeScript rules
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',

		// General rules
		'no-console': 'warn',
		'prefer-const': 'error',
		'no-var': 'error',

		// n8n rules - allow flexibility during development
		'n8n-nodes-base/node-param-description-missing-final-period': 'warn',
		'n8n-nodes-base/node-param-description-excess-final-period': 'warn',
		'n8n-nodes-base/node-param-description-unencoded-angle-brackets': 'warn',
		'n8n-nodes-base/node-class-description-missing-subtitle': 'off',
		'n8n-nodes-base/node-param-options-type-unsorted-items': 'off',
	},

	overrides: [
		{
			files: ['*.json'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			extends: ['plugin:n8n-nodes-base/community'],
			rules: {
				'n8n-nodes-base/community-package-json-name-still-default': 'off',
			},
		},
	],
};
