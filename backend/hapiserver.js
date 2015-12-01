'use strict';

var Hapi = require('hapi');
var server = new Hapi.Server();

var dbConfig = {
	'url': 'mongodb://localhost:27017/justdoit',
	'settings': {
		'db': {
			'native_parser': false //native parser is deprecated let's set this to false :)
		}
	},
	decorate: true
};

var plugins = [{
	register: require('hapi-mongodb'),
	options: dbConfig
}, {
	register: require('hapi-auth-cookie')
}, {
	register: require('inert')
}];

server.connection({
	port: 3000
});

var routes = require('./routes/routes');

var setUniqueIndexes = function(db) {
	var userCollection = 'user';
	var productCollection = 'product';

	db.collection(userCollection).createIndex({
		username: 1
	}, {
		unique: true
	});
	db.collection(productCollection).createIndex({
		code: 1
	}, {
		unique: true
	});
};

server.register(plugins, function(err) {
	if (err) {
		throw err;
	}

	server.auth.strategy('session', 'cookie', {
		password: 'asdasdkl1231231289((*(213klasdlkasdjaskldjaslkdsaasd##$%!!!#',
		cookie: 'libcookie',
		isSecure: false
	});

	server.route(routes);

	server.start(function() {
		setUniqueIndexes(server.mongo.db);
		console.log('info', 'Server running at ', server.info.uri);
	});
});
