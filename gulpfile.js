'use strict'

const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const plugin = require('./index');

gulp.task('default', function () {
    return gulp.src([
        './tests/*.js'
    ])
        .pipe(plugin({
            concurrency_value: 10,
            jasmine_opts: {
                verbose: true,
                includeStackTrace: true
            }
        }))
        .on('error', function (err) {
            throw new Error(err);
        });
});
