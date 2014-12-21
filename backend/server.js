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

app.use('/etorrent', router);
app.get('*', function(req, res) {
	res.sendFile(resolvedPath);
});

app.listen(port);
console.log("App listening on port " + port);


var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/justdoit';
MongoClient.connect(url, function(err, db) {
	var collection = db.collection('producto');
	collection.find({}).toArray(function(err, docs){
		console.log("Existen " + docs.length + "registros:")
	  	if(docs.length < 5){
	  		console.log("Existen menos de 5 registros, agreguemos 2")
	  		collection.insert([{nombre: "Mario", valor: 10}, {nombre: "Osmin", valor: 20}], function(err, result){
			  	console.log("Registros agregados: ")
			  	console.log(result)
			  	db.close()
			})
	  	}else if(docs.length > 5){
	  		console.log("Existen mas de 5 registros, borremos todo")
			collection.remove({}, function(err, result){
				console.log( "Registros borrados: ")
				console.log(result)
			  	db.close()
			})
	  	}
	 })
});