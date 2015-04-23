var Hapi   = require('hapi');
var server = new Hapi.Server();

var dbConfig = {
	"url": 'mongodb://localhost:27017/justdoit',
	"settings": {
		"db": {
			"native_parser": false //native parser is deprecated let's set this to false :)
		}
	}
};

var plugins = [{
	register: require('hapi-mongodb'),
	options: dbConfig
}, {
	register: require('hapi-auth-cookie')
}];

server.connection({
	port: 3000
});

var routes = require('./routes/routes');

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
		console.log('info', 'Server running at ', server.info.uri);
	});
});
