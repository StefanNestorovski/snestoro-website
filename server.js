var path = require('path');
var alpha = require('alphavantage')({key: '13H9GAWTQGC51OLB'});
var express = require('express'),
    fs = require('fs'),
    app = express();
require('./stockBuddy')(app);
	
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