var path = require('path');
var express = require('express'),
    fs = require('fs'),
    app = express();
require('./stockBuddy/stockBuddy')(app);
	
var port = process.env.PORT || 8000;

app.get('/resume', function (req, res) {
    var filePath = "/resume/resume.pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.use('/', express.static(path.join(__dirname + '/')));

app.listen(port, function() {
  console.log('listening on port ' + port);
});