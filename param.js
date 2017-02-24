var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var module = require('./index.js');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(express.bodyParser());
app.use(express.static(__dirname));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/main_page.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.post('/', function (req, res) {
	console.log(req.body.link);
	//res.json({ link: req.body.link });
	var module = require('./index.js');
	module.get_datas(req.body.link);
	/*(function wait_3 () {
		   if (module.price_expected == "") {
			   console.log("wait3");
			   setTimeout(wait_3, 1000);
			}
		   else {
			   res.sendFile(path.join(__dirname + '/results.html'));
			}
		})();*/
	
});