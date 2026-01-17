/**
 * @type {import('@types/eslint').ESLint.ConfigData}
 * 
 * Stricter ESLint config for prepublish checks
 * These rules are enforced before publishing to npm
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
		// TypeScript rules - stricter for publishing
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/ban-ts-comment': 'warn',

		// General rules
		'no-console': 'error',
		'prefer-const': 'error',
		'no-var': 'error',

		// n8n rules - stricter for publishing
		'n8n-nodes-base/node-param-description-missing-final-period': 'error',
		'n8n-nodes-base/node-param-description-excess-final-period': 'error',
		'n8n-nodes-base/node-param-description-unencoded-angle-brackets': 'error',
		'n8n-nodes-base/node-class-description-missing-subtitle': 'warn',
		'n8n-nodes-base/node-param-options-type-unsorted-items': 'warn',
	},

	overrides: [
		{
			files: ['*.json'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			extends: ['plugin:n8n-nodes-base/community'],
			rules: {
				'n8n-nodes-base/community-package-json-name-still-default': 'error',
			},
		},
	],
};
