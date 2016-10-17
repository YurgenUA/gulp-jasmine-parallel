'use strict'

const gulp = require('gulp');
const jasmine = require('gulp-jasmine');


const StdOutCapture = require('./lib/stdout.js');
gulp.task('default', function () {
    let hidden = '';
    let c = new StdOutCapture();
    c.capture((string, encoding, fd) => {
        hidden += string; 
    });
    console.log('from gulpfile');
    c.invoke_original_stdout_write("during capture. should be immediately seen!\n");
    c.release();
    console.log('hidden string has after release:', hidden);
});

/*const jasmine_parallel = require('./index');

gulp.task('default', function () {
    return gulp.src([
        './tests/*.js'
    ])
        .pipe(jasmine_parallel({
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
*/
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

gulp.run('default');