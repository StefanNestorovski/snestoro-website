var path = require('path');
var alpha = require('alphavantage')({key: '13H9GAWTQGC51OLB'});
var express = require('express'),
    fs = require('fs'),
    app = express();
	
var port = process.env.PORT || 8000;

app.use('/', express.static(path.join(__dirname + '/')));

app.get('/resume', function (req, res) {
    var filePath = "/resume/resume.pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.get('/stocks', function (req, res) {
	var now = new Date();
	var total = 0;
	var idx = 0;
	
	get_quote("WEED");

	function getTimeNow(){
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var date = now.getDate();
		var hour = now.getHours();
		var minute = now.getMinutes();
		if(minute < 10){
			minute = '0' + minute;
		}
		return year + "-" + month + "-" + date + " " + hour + ":" + minute;
	}
	
	function get_quote(ticker) {
		alpha.data.intraday(ticker).then((data) => {
			var now = new Date();
	
			var dayobj = data['Time Series (1min)'];
	
			for (var props in dayobj) {
				var time = props;
				break;
			}
	
			var timeobj = dayobj[time];
			var curPrice = timeobj['4. close'];
			res.write(curPrice);
			res.end();
		}).catch(function () {
			console.log("Promise Rejected for " + ticker);
		});
	}

});

app.listen(port, function() {
  console.log('listening');
});