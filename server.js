var path = require('path');
var express = require('express');

var app = express();
var port = process.env.PORT || 8000;

app.use('/', express.static(path.join(__dirname + '/')));

app.get('/resume', (req, res) => 
		res.sendFile(path.join(__dirname, '../resume', 'resume.pdf'));
	)

app.listen(port, function() {
  console.log('listening');
});