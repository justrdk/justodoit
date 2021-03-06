'use strict';

module.exports = {
	getAllUsers: function(request, cb) {
		var db = request.mongo.db;
		var collectionName = 'user';
		var findJSON = {
			active: true
		};

		if (request.params.hasOwnProperty('filter')) {
			var regVal = new RegExp(request.params.filter, 'i');
			findJSON.$or = [{
				'username': regVal
			}];
		}

		db.collection(collectionName).find(findJSON).toArray(function(err, users) {
			if (users.length > 0) {
				cb({
					success: true,
					data: users
				});
			} else {
				cb({
					success: false,
					errorMessage: 'No se encontraron usuarios con el filtro ingresado',
					data: []
				});
			}
		});
	},

	getUser: function(request, cb) {
		var db = request.mongo.db;
		var ObjectId = request.mongo.ObjectID;
		var userId = request.params._id;
		var collectionName = 'user';

		db.collection(collectionName).find({
			_id: new ObjectId(userId),
			active: true
		}).toArray(function(err, docs) {
			if (docs.length) {
				cb({
					success: true,
					data: docs[0]
				});
			} else {
				cb({
					success: false,
					errorMessage: 'No existe el usuario que desea leer'
				});
			}
		});
	},

	createUser: function(request, cb) {
		var collectionName = 'user';
		var db = request.mongo.db;
		var crypto = require("crypto-js");
		var newUser = {
			username: request.payload.username,
			password: String(crypto.AES.encrypt(request.payload.password, 'secret')),
			firstname: request.payload.firstname,
			lastname: request.payload.lastname,
			active: true,
			roleId: request.payload.roleId
		};

		db.collection(collectionName).save(newUser, function(err, result) {
			if (err) {
				cb({
					success: false,
					errorMessage: 'Hubo un error en la creación del usuario',
					metadata: err
				});
			} else {
				cb({
					success: true,
					id: result._id
				});
			}
		});
	},

	updateUser: function(request, cb) {
		var collectionName = 'user';
		var db = request.mongo.db;
		var ObjectId = request.mongo.ObjectID;
		var fields = ['username', 'password', 'firstname', 'lastname', 'roleId'];
		var userId = request.payload._id;
		var updateJSON = {};
		var crypto = require("crypto-js");

		for (var key in request.payload) {
			if (fields.indexOf(key) !== -1) {
				updateJSON[key] = key !== 'password' ? request.payload[key] : String(crypto.AES.encrypt(request.payload[key], 'secret'));
			}
		}

		db.collection(collectionName).update({
			'_id': new ObjectId(userId)
		}, {
			$set: updateJSON
		}, function(err) {
			if (err) {
				cb({
					success: false,
					errorMessage: 'Hubo un error en la actualizaciòn del usuario',
					metadata: err
				});
			} else {
				cb({
					success: true
				});
			}
		});
	},

	deleteUser: function(request, cb) {
		var collectionName = 'user';
		var db = request.mongo.db;
		var ObjectId = request.mongo.ObjectID;
		var userId = request.payload._id;

		db.collection(collectionName).update({
			'_id': new ObjectId(userId)
		}, {
			$set: {
				active: false
			}
		}, function(err) {
			if (err) {
				cb({
					success: false,
					errorMessage: 'Hubo un error en la eliminación del usuario',
					metadata: err
				});
			} else {
				cb({
					success: true
				});
			}
		});
	}
};
