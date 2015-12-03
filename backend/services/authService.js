'use strict';

module.exports = {
	authenticateUser: function(request, cb) {
		var userCollection = 'user';
		var db = request.mongo.db;

		if (!request.payload.username || !request.payload.password) {
			return cb({
				success: false,
				error: 'Missing username or password'
			});
		} else {
			db.collection(userCollection).findOne({
				'username': request.payload.username
			}, function(err, user) {
				if (err) {
					return cb({
						success: false,
						error: 'Internal MongoDB error'
					});
				}

				if (!user || user.password !== request.payload.password) {
					return cb({
						success: false,
						error: 'Invalid username or password'
					});
				} else {
					user.scope = '' + user.roleId;
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
				isAdmin: request.auth.credentials.roleId === 1 ? true : false
			};
		} else {
			reply = {
				success: false,
				message: 'no user authenticated'
			};
		}

		cb(reply);
	}
};
