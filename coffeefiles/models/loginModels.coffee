'use strict'

define ['can'], (can) ->

	LoginModel = can.Model.extend
		findOne : 'GET /getAuthenticatedUser'
		create : (attrs) ->
			$.post 'http://localhost:3000/login', attrs
	, {}
