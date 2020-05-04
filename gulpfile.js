const gulp = require('gulp');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');

gulp.task('default', function() {
	return gulp.src('./H.browser.js')
	.pipe(webpack(/*{
		entry: {
			app: 'H.js',
		},
		output: {
			filename: 'H.min.js',
		},
	}*/))
	.pipe(rename('H.min.js'))
	.pipe(gulp.dest('dist/'));
});
