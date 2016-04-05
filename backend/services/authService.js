'use strict';

module.exports = {
	authenticateUser: function(request, cb) {
		var userCollection = 'user';
		var db = request.mongo.db;
		var crypto = require('crypto-js');

		if (!request.payload.username || !request.payload.password) {
			return cb({
				success: false,
				error: 'Missing username or password'
			});
		} else {
			db.collection(userCollection).findOne({
				username: request.payload.username
			}, function(err, user) {
				if (err) {
					return cb({
						success: false,
						errorMessage: 'Internal MongoDB error'
					});
				}

				if (!user) {
					return cb({
						success: false,
						errorMessage: 'Usuario o contraseña invalidos'
					});
				}

				var bytes = crypto.AES.decrypt(user.password, 'secret');
				var decryptedPassword = bytes.toString(crypto.enc.Utf8);

				if (decryptedPassword !== request.payload.password) {
					return cb({
						success: false,
						errorMessage: 'Usuario o contraseña invalidos'
					});
				} else {
					user.scope = '' + user.roleId;
					delete user.password;
					request.auth.session.set(user);
					return cb({
						success: true,
						user: user
					});
				}
			});
		}
	},

	logOutUser: function(request, cb) {
		request.auth.session.clear();
		cb({
			success: true
		});
	},

	getAuthenticatedUser: function(request, cb) {
		var reply;
		if (request.auth.credentials && request.auth.credentials.username) {
			reply = {
				success: true,
				firstname: request.auth.credentials.firstname,
				lastname: request.auth.credentials.lastname,
				roleId: request.auth.credentials.roleId,
				username: request.auth.credentials.username,
				isAdmin: parseInt(request.auth.credentials.roleId, 10) === 1 ? true : false
			};
		} else {
			reply = {
				success: false,
				errorMessage: 'No hay usuario autenticado'
			};
		}

		cb(reply);
	}
};
