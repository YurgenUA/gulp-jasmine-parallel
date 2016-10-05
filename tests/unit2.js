describe("second suite", function() {
  it("second suite: first test", function(done) {
    expect(true).toBeTruthy();
    console.log('1st 2 !!!!!', new Date().toString());
    setTimeout(done, 2000);
  });

  it("second suite: second test", function(done) {
    expect(false).toBeTruthy();
    console.log('2nd 2 !!!!!', new Date().toString());
    setTimeout(done, 2000);
  });
});


