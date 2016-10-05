describe("first suite", function() {
  it("first suite: first test", function(done) {
    expect(true).toBeTruthy();
    console.log('1st !!!!!', new Date().toString());
    setTimeout(done, 2000);
  });

  it("first suite: second test", function(done) {
    expect(true).toBeTruthy();
    console.log('2nd !!!!!', new Date().toString());
    setTimeout(done, 2000);
  });
});

