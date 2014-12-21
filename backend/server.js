var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
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

MongoClient.connect(dbUrl, function(err, db) {
	router.get('/producto/list', function(req, res){
		db.collection('producto').find({}).toArray(function(err, docs){
			res.json(docs);
		})
	})

	router.post('/producto/create', function(req, res){
		db.collection('producto').insert([{nombre: req.body.nombre, valor: req.body.valor}], function(err, result){
		  	console.log("Registros creados: ")
		  	res.json(result)
		  	db.close()
		})
	})
});
