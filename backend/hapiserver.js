'use strict';

var Hapi = require('hapi');
var server = new Hapi.Server();

var dbConfig = {
	'url': 'mongodb://127.0.0.1:27017/justdoit',
	'settings': {
		'db': {
			'native_parser': false
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
		unique: true,
		sparse: true
	});
	db.collection(productCollection).createIndex({
		code: 1
	}, {
		unique: true,
		sparse: true
	});
};

var createAdminUser = function(db) {
	var userCollection = 'user';
	var crypto = require("crypto-js");
	var password = crypto.AES.encrypt('password1', 'secret');
	var roles = require('./routes/rolesEnum');

	db.collection(userCollection).findOne({
		'username': 'admin'
	}, function(err, user) {
		if (err) {
			return err;
		}

		if (!user) {
			var newUser = {
				username: 'admin',
				password: String(password),
				firstname: 'maribel',
				lastname: 'mercadal',
				active: true,
				roleId: roles.admin
			};

			db.collection(userCollection).save(newUser, function(err, result) {
				if (err) {
					return err;
				} else {
					return result;
				}
			});
		}
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
		createAdminUser(server.mongo.db);
		console.log('info', 'Server running at ', server.info.uri);
	});
});
