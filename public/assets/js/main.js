require.config({
	paths: {
		"jquery": '../libs/jquery-2.1.1',
		"can": "../libs/canjs.com-2.1.3/amd-dev/can",
		"bootstrap": '../libs/bootstrap.min'
	},
	shim: {
		"jquery": {
			exports: '$'
		},
		"can": {
			exports: 'can'
		},
		'bootstrap': {
			deps: ['jquery']
		}
	}
});

requirejs(['controllers/router']);