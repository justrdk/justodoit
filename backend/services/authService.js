module.exports = {
	authenticateUser: function(request, cb) {
		var userCollection = 'user';
		var db = request.server.plugins['hapi-mongodb'].db;
		var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;

		if (request.auth.isAuthenticated) {
			cb({
				success: true,
				firstname: request.auth.credentials.firstname,
				lastname: request.auth.credentials.lastname,
				username: request.auth.credentials.username,
				role: request.auth.credentials.role
			});
		}

		if (!request.payload.username || !request.payload.password) {
			cb({
				success: false,
				error: 'Missing username or password'
			});
		} else {
			db.collection(userCollection).findOne({
				'username': request.payload.username
			}, function(err, user) {
				if (err) {
					cb({
						success: false,
						error: 'Internal MongoDB error'
					});
				}

				if (!user || user.password !== request.payload.password) {
					cb({
						success: false,
						error: 'Invalid username or password'
					});
				} else {
					request.auth.session.set(user);
					cb({
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
				firstName: request.auth.credentials.firstname,
				lastName: request.auth.credentials.lastname,
				role: request.auth.credentials.role,
				username: rquest.auth.credentials.username

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
