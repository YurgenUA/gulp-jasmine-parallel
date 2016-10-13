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
                includeStackTrace: true,
                errorOnFail: false
            }
        }))
        .on('error', function (err) {
           // throw new Error(err);
           console.log('gulp on error');
        });
});

gulp.task('unit-test', (cb) => {
    return gulp.src([
        './tests/**/*.test.js'
    ])
        .pipe(jasmine({
            timeout: 1000,
            verbose: true,
            integration: true,
            abortOnTestFailure: true
        }))
        .on('done', function (result) {
            if (result.failed) {
                cb('test(s) failed');
            } else {
                cb(null);
            }
        });
});