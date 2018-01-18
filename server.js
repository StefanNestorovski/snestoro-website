var path = require('path');
var express = require('express');

var app = express();
var port = process.env.PORT || 8000;

app.use('/', express.static(path.join(__dirname + '/')));

app.post('/resume', function(req, res, next) {
  var stream = fs.readStream('/resume');
  var filename = "resume.pdf"; 
  // Be careful of special characters

  filename = encodeURIComponent(filename);
  // Ideally this should strip them

  res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
  res.setHeader('Content-type', 'application/pdf');

  stream.pipe(res);
});

app.listen(port, function() {
  console.log('listening');
});