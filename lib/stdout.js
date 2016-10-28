'use strict'

class StdOutCapture {
    constructor(streamToCapture) {
        this.capturedStream = streamToCapture || process.stdout;
        this.original_stdout_write = undefined;
    }

    capture(callback) {
        if (callback === undefined || typeof (callback) != 'function') {
            throw Error('Callback is not specified.');
        };
        this.original_stdout_write = this.capturedStream.write;
        this.capturedStream.write = (write => {
            return (string, encoding, fd) => {
                callback(string, encoding, fd);
            };
        })(this.capturedStream.write);
    }

    release() {
        this.capturedStream.write = this.original_stdout_write;
    }

    invoke_original_stdout_write(){
        this.original_stdout_write.apply(this.capturedStream, arguments);
    }
}

module.exports = StdOutCapture;