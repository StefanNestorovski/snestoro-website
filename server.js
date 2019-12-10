let path = require('path');
let express = require('express'),
    fs = require('fs'),
    app = express();

let port = process.env.PORT || 8000;

app.use(express.static('public')); //Serves resources from public folder

app.get('/resume', function (req, res) {
    var filePath = "/resume/resume.pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});


app.listen(port, function() {
  console.log('listening on port ' + port);
});
