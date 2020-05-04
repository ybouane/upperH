const gulp = require('gulp');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');

gulp.task('default', () => {
	return gulp.src('./H.browser.js')
	.pipe(webpack())
	.pipe(rename('H.min.js'))
	.pipe(gulp.dest('dist/'));
});




const jsdoc2md = require('jsdoc-to-markdown')
const fs = require('jsdoc-to-markdown')
const H = require('./H.server.js');
gulp.task('docs', async (done) => {
	var output = await jsdoc2md.render({
		files		: 'H.*.js',
		template	: await H.readFile('./readme-template.md'),
	})
	console.log(output);
	await H.writeFile('./README.md', output);
	return done();
})