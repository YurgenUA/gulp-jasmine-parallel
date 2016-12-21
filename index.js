'use strict'

const qasync = require('async-queue-stream');
const stream = require('stream');
const jasmine = require('gulp-jasmine');
const StdOutCapture = require('./lib/stdout.js');

let reporters = new Map();
let stdout_capture = new StdOutCapture();

var jasmine_parallel = function (opts) {

    let consolelogs = [];
    stdout_capture.capture((string, encoding, fd) => {
        consolelogs.push({
            string: string,
            encoding: encoding,
            fd: fd
        });
    });

    return qasync(function (data, cb) {
        {
            var staticReporter = {
                jasmineStarted: function (suiteInfo) {
                    let cur_rep = reporters.get(this);
                    cur_rep.totalSpecsDefined = suiteInfo.totalSpecsDefined;
                },
                suiteStarted: function (result) {
                    let cur_rep = reporters.get(this);
                    cur_rep.description = result.description;
                    cur_rep.fullName = result.fullName;
                },
                specStarted: function (result) {
                    // do nothing
                },
                specDone: function (result) {
                    let cur_rep = reporters.get(this);
                    if (result.status == 'passed') {
                        cur_rep.passed.add(result.description);
                        stdout_capture.invoke_original_stdout_write( '\x1B[32m+\x1B[39m');
                    };
                    if (result.status == 'failed') {
                        for (var i = 0; i < result.failedExpectations.length; i++) {
                            cur_rep.failed.add({
                                description: result.description,
                                message: result.failedExpectations[i].message,
                                stack: result.failedExpectations[i].stack
                            });
                        }
                        stdout_capture.invoke_original_stdout_write('\x1B[31m-\x1B[39m');
                    }
                },
                suiteDone: function (result) {
                    let cur_rep = reporters.get(this);
                    cur_rep.status = result.status;
                },
                jasmineDone: function () {
                    // do nothing
                }
            };

            reporters.set(staticReporter, { passed: new Set(), failed: new Set(), jasmineFinalStatus: null });
            opts.jasmine_opts.reporter = staticReporter;


            var s = new stream.Readable({ objectMode: true });
            s.push(data);
            s.push(null);
            s.pipe(
                jasmine(opts.jasmine_opts))
                .on('jasmineDone', (x) => {
                    let cur_rep = reporters.get(staticReporter);
                    cur_rep.jasmineFinalStatus = x;
                    cb();
                })
                .on('error', x => {
                    let cur_rep = reporters.get(staticReporter);
                    cur_rep.jasmineFinalStatus = 'error';
                    cb(x);
                });
        }

    }, () => {
        stdout_capture.release();

        let run_passed = 0;
        let run_total = 0;
        let cumulative_jasmine_status = true;
        console.log("\n================== Cumulative console output =====================");
        consolelogs.forEach(x => { console.log(x.string) });
        console.log("==================== Cumulative statistics =======================");
        for (let suite of reporters.values()) {
            console.log(`Suite '${suite.fullName}' with description '${suite.description}' statistics:`);
            for (let passed of suite.passed) {
                console.log(`\x1B[32m\ttest: ${passed}\x1B[39m`);
            }
            if (suite.failed.size != 0) {
                for (let failed of suite.failed) {
                    console.log(`\x1B[31m\ttest: ${failed.description}\x1B[39m`);
                    console.log(`\t\tmessage: ${failed.message}`);
                    console.log(`\t\tstack: ${failed.stack}`);
                }
            }
            run_passed += suite.passed.size;
            run_total += suite.totalSpecsDefined
            console.log(`\tIn current suite: passed ${suite.passed.size} out of ${suite.totalSpecsDefined}.`);
            if (!suite.jasmineFinalStatus)
                cumulative_jasmine_status = false;

        }
        console.log(`Whole run: passed ${run_passed} out of ${run_total}.`);
        console.log('Jasmine finished whole run with status', cumulative_jasmine_status ? "\x1B[32mOK!\x1B[39m": "\x1B[31mFailed:(\x1B[39m");

        if (opts.done_callback){
            opts.done_callback(cumulative_jasmine_status);
        }
        if(!cumulative_jasmine_status){
            // Throwing error since at least one run has error
           throw new Error('Jasmine finished whole run with status FAILED:()')
        }

        
    }, { concurrency: opts.concurrency_value, error_event : 'error' })
};




module.exports = jasmine_parallel;
