# gulp-jasmine-parallel

[![Build status](https://api.travis-ci.org/YurgenUA/gulp-jasmine-parallel.svg?branch=master)](https://api.travis-ci.org/YurgenUA/gulp-jasmine-parallel)

Run Jasmine tests in parallel.

## Install
$ npm install --save-dev gulp-jasmine-parallel

## Usage
```bash
const jasmine-parallel = require('gulp-jasmine-parallel');

gulp.task('default', function () {
    return gulp.src([
        './tests/*.js'
    ])
        .pipe(jasmine-parallel({
            concurrency_value: 5,
            jasmine_opts: {
                verbose: true,
                includeStackTrace: true,
                errorOnFail: false
            }
        }));
});
```

