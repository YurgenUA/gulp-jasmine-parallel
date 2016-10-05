'use strict'

const qasync = require('async-queue-stream');
const stream = require('stream');
const jasmine = require('gulp-jasmine');

var plugin = function (opts) {

    return qasync(function (data, cb) {

        {
            var s = new stream.Readable({ objectMode: true });
            s.push(data);
            s.push(null);
            s.pipe(
                jasmine(opts.jasmine_opts))
                .on('jasmineDone', (x) => {
                    cb();
                });
        }

    }, { concurrency: opts.concurrency_value });
};

module.exports = plugin;
