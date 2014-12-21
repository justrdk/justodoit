var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();

var port = process.env.PORT || 8080;
var resolvedPath = path.resolve('/../public/index.html');
var dbUrl = 'mongodb://localhost:27017/justdoit';

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());

router.use(function(req, res, next) {
	console.log(req.method, req.url);
	next();
});

app.use('/libuniversal', router);
app.get('*', function(req, res) {
	res.sendFile(resolvedPath);
});

app.listen(port);
console.log("App listening on port " + port);

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(dbUrl, function(err, db) {
	console.log('connected to mongodb');

	router.get('/product/list', function(req, res){
		db.collection('producto').find({}).toArray(function(err, docs){
			res.json(docs);
		})
	})

	router.post('/product/create', function(req, res){

		var newProduct = {
			code : req.body.code,
			name : req.body.name,
			price: req.body.price,
			quantity: req.body.quantity,
			provider : req.body.provider
		};

		db.collection('producto').insert([newProduct], function(err, result){
			//need to return id here
		  	res.json({success: true});
		  	db.close();
		})
	})
});
