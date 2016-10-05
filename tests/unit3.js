'use strict'

describe("third suite", function() {
  it("third suite: first test", function(done) {
    expect(true).toBeTruthy();
    console.log('1st 3 !!!!!', new Date().toString());
    setTimeout(done, 2000);
  });

  it("third suite: second test", function(done) {
    expect(true).toBeTruthy();
    console.log('2nd 3 !!!!!', new Date().toString());
    setTimeout(done, 2000);
  });
});


