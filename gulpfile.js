const { src, dest } = require('gulp');

/**
 * Copy icon files to the dist folder
 * This task copies SVG icons alongside the compiled JavaScript files
 */
function buildIcons() {
	return src('nodes/**/*.svg')
		.pipe(dest('dist/nodes'));
}

/**
 * Copy credential icons if any
 */
function buildCredentialIcons() {
	return src('credentials/**/*.svg')
		.pipe(dest('dist/credentials'));
}

exports['build:icons'] = buildIcons;
exports['build:credentialIcons'] = buildCredentialIcons;
exports.default = buildIcons;
