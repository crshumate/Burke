var stream = Model.find().stream();

stream.on('data', function (doc) {
  // do something with the mongoose document
}).on('error', function (err) {
  // handle the error
}).on('close', function () {
  // the stream is closed
});