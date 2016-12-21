# gulp-jasmine-parallel

[![Build status](https://api.travis-ci.org/YurgenUA/gulp-jasmine-parallel.svg?branch=master)](https://api.travis-ci.org/YurgenUA/gulp-jasmine-parallel)

### Run Jasmine tests in parallel.
Package uses [gulp-jasmine](https://www.npmjs.com/package/gulp-jasmine) under the hood but allows parallel Jasmine suite running. This can be handy if you run quite time consuming tests (component, system etc.)
## Install
$ npm install --save-dev gulp-jasmine-parallel

## Usage
```javascript
const jasmine_parallel = require('gulp-jasmine-parallel');

gulp.task('default', function () {
    return gulp.src([
        './tests/*.js'
    ])
        .pipe(jasmine_parallel({
            concurrency_value: 5,
            jasmine_opts: {
                verbose: true,
                includeStackTrace: true,
                errorOnFail: false
            }
        }));
});
```
## API

### jasmine_parallel([options])

#### concurrency_value
Type:number.
The amount of simultaneously invoked suits. (The best scenario to reach the desired level of parallelism is to put each suite in separate js-file)

#### jasmine_opt
Type: object.
gulp-jasmine package options. [See](https://www.npmjs.com/package/gulp-jasmine#jasmineoptions)

#### done_callback
Mandatory: optional
Type: function.
Callback function to be called when as the very last step.
Params: all_tests_passed - boolean


### License
MIT
