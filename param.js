var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');


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
	res.json({ link: req.body.link });
	require(path.join(__dirname +'/index.js'));
		
	res.sendFile(path.join(__dirname + '/results.html'));
});