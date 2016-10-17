'use strict'

class StdOutCapture {
    constructor(streamToCapture, callback) {
        this.capturedStream = streamToCapture ||  process.stdout;
        this.callback = callback;

    }

    capture(){
        this.capturedStream.write = (write => {
            return (string, encoding, fd) => {
                if(this.callback === undefined || typeof(this.callback) != 'function'){
                     throw Error('Callback is not specified.');
                };
                this.callback(string, encoding, fd);
               // console.log('Yuri', string);
            };
        })(this.capturedStream.write);
    }

    release(){
        stream.write = original_stdout_write;
    }
}

module.exports = StdOutCapture;