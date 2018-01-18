var path = require('path');
var express = require('express');

var app = express();
var port = process.env.PORT || 8000;

app.use('/', express.static(path.join(__dirname + '/')));

app.get('/resume', function (req, res) {
    var filePath = "/resume/resume.pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.listen(port, function() {
  console.log('listening');
});