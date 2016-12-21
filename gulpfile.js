'use strict'

const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const jasmine_parallel = require('./index');

gulp.task('default', function (cb) {
    return gulp.src([
        './tests/unit*.js'
    ])
        .pipe(jasmine_parallel({
            concurrency_value: 2,
            jasmine_opts: {
                verbose: true,
                includeStackTrace: true,
                errorOnFail: false
            },
            done_callback: (result) => {
                console.log('---------- in done_callback(...)', result);
                if (result)
                    return cb();
                else
                    return cb('error');
            }
        }))
        .on('done', function (result) {
            console.log('gulp on done');
            cb(null);
        })
        .on('error', function (err) {
            console.log('gulp on error');
            cb(err);
        })
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
