require.config({
	paths: {
		"jquery": '../libs/jquery-2.1.1',
		"can": "../libs/canjs.com-2.1.3/amd-dev/can",
		"bootstrap": '../libs/bootstrap.min',
		'noty': '../libs/jquery.noty.packaged.min',
		'typehead': '../libs/typehead',
		'datepicker': '../libs/datepicker',
		'moment' : '../libs/moment'
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
		},
		'noty': {
			deps: ['jquery']
		},
		'typehead' : {
			deps: ['jquery']
		},
		'datepicker' : {
			deps: ['jquery']
		}
	}
});

requirejs(['bootstrap', 'noty', 'typehead', 'datepicker', 'moment', 'controllers/router']);