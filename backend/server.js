var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();

var port = process.env.PORT || 8081;
var resolvedPath = path.resolve('/../public/index.html');
var dbNamespace = 'justdoit';
var dbUrl = 'mongodb://localhost:27017/' + dbNamespace;

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
var ObjectID = require('mongodb').ObjectID;

MongoClient.connect(dbUrl, function(err, db) {
	var requirejs = require('requirejs');
	requirejs.config({
		nodeRequire: require
	});
	var namespace = {
		db: db,
		objectId: ObjectID
	}
	var isvExists = false;

	// a default isv collection with value will already be created as soon as server is started in case it doesn't exist.
	//Default ISV will be set to 15%

	var createDefaultISV = function() {
		var collection = db.collection('isv');
		//when using on calculations divide by 100 since its the percentage what is stored on this collection
		var isv = {
			value: 15,
			active : true
		};
		collection.insert(isv);
	};

	var createEndpoint = function(method, urlPath, endpointFunction) {
		router[method](urlPath, function(req, res) {
			try{
				endpointFunction(namespace, req, res)
			}catch(e){
				console.log(e);
			}
		})
	};

	db.collections(function(err, collections) {
		for (var i = collections.length - 1; i >= 0; i--) {
			if (collections[i].namespace === dbNamespace + ".isv") {
				isvExists = true;
			}
		};

		if (!isvExists) {
			createDefaultISV();
		}
	});

	requirejs(['provider', 'product', 'salesOrder', 'isv'],
		function(provider, product, salesOrder, isv) {
			createEndpoint('get', '/provider/list', provider.list);
			createEndpoint('get', '/provider/read/:_id', provider.read);
			createEndpoint('post', '/provider/create', provider.create);
			createEndpoint('post', '/provider/update', provider.update);
			createEndpoint('post', '/provider/delete', provider.delete);

			createEndpoint('get', '/product/list', product.list);
			createEndpoint('get', '/product/list/:filter', product.list);
			createEndpoint('get', '/product/read/:_id', product.read);
			createEndpoint('post', '/product/create', product.create);
			createEndpoint('post', '/product/update', product.update);
			createEndpoint('post', '/product/delete', product.delete);

			createEndpoint('get', '/salesOrder/list', salesOrder.list);
			createEndpoint('get', '/salesOrder/read/:_id', salesOrder.read);
			createEndpoint('post', '/salesOrder/create', salesOrder.create);
			createEndpoint('post', '/salesOrder/findByDate', salesOrder.findByDate);

			createEndpoint('get', '/isv/read', isv.read);
			createEndpoint('post', '/isv/update', isv.update);
		});
});