var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();


router.use(function(req, res, next) {
	console.log(req.method, req.url);
	next();
});


var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var resolvedPath = path.resolve('/../public/index.html');

app.use('/libuniversal', router);
app.get('*', function(req, res) {
	res.sendFile(resolvedPath);
});

app.listen(port);
console.log("App listening on port " + port);