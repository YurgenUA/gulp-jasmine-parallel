'use strict'

describe("fourth suite", function() {
  it("fourth suite: first test", function(done) {
    expect(true).toBeTruthy();
    console.log('1st 4 !!!!!', new Date().toString());
    setTimeout(done, 2000);
  });

  it("fourth suite: second test", function(done) {
    expect(true).toBeTruthy();
    console.log('2nd 4 !!!!!', new Date().toString());
    setTimeout(done, 2000);
  });
});


