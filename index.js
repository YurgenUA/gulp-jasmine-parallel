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
                        stdout_capture.invoke_original_stdout_write( '+');
                    };
                    if (result.status == 'failed') {
                        for (var i = 0; i < result.failedExpectations.length; i++) {
                            cur_rep.failed.add({
                                message: result.failedExpectations[i].message,
                                stack: result.failedExpectations[i].stack
                            });
                        }
                        stdout_capture.invoke_original_stdout_write("-");
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
                    throw x;
                });
        }

    }, () => {
        stdout_capture.release();

        let run_passed = 0;
        let run_total = 0;
        console.log("\n================== Cumulative console output =====================");
        consolelogs.forEach(x => { console.log(x.string) });
        console.log("==================== Cumulative statistics =======================");
        for (let suite of reporters.values()) {
            console.log(`Suite '${suite.fullName}' with description '${suite.description}' statistics:`);
            console.log('\tGreen:');
            for (let passed of suite.passed) {
                console.log(`\t\t${passed}`);
            }
            if (suite.failed.size != 0) {
                console.log('\tRed:');
                for (let failed of suite.failed) {
                    console.log(`\t\tmessage:${failed.message}`);
                    console.log(`\t\tstack:${failed.stack}`);
                }
            }
            run_passed += suite.passed.size;
            run_total += suite.totalSpecsDefined
            console.log(`\tIn current suite: passed ${suite.passed.size} out of ${suite.totalSpecsDefined}.`);
            console.log('Jasmine done with status', suite.jasmineFinalStatus);

        }
        console.log(`Whole run: passed ${run_passed} out of ${run_total}.`);

    }, { concurrency: opts.concurrency_value })
};




module.exports = jasmine_parallel;
