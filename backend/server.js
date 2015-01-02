var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();

var port = process.env.PORT || 8081;
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

	var createEndpoint = function(method, urlPath, endpointFunction){
		router[method](urlPath, function(req, res){
			endpointFunction(namespace, req, res)
		})
	}

	requirejs(['provider', 'product', 'salesOrder'],
		function(provider, product, salesOrder) {
			createEndpoint('get', '/provider/list', provider.list)
			createEndpoint('get', '/provider/read/:_id', provider.read)
			createEndpoint('post', '/provider/create', provider.create)
			createEndpoint('post', '/provider/update', provider.update)
			createEndpoint('post', '/provider/delete', provider.delete)

			createEndpoint('get', '/product/list', product.list)
			createEndpoint('get', '/product/list/:filter', product.list)
			createEndpoint('get', '/product/read/:_id', product.read)
			createEndpoint('post', '/product/create', product.create)
			createEndpoint('post', '/product/update', product.update)
			createEndpoint('post', '/product/delete', product.delete)

			createEndpoint('get', '/salesOrder/list', salesOrder.list)
			createEndpoint('get', '/salesOrder/read/:_id', salesOrder.read)
			createEndpoint('post', '/salesOrder/create', salesOrder.create)
		});
});