'use strict'

define ['can'], (can) ->

	UserModel = can.Model.extend
		findOne : 'GET /getUser/{_id}'
		findAll : 'GET /getUsers'
		destroy : (params) ->
			$.ajax
				url: '/deleteUser'
				type: 'post'
				contentType: "application/json"
				dataType: 'json'
				data: JSON.stringify(params)
		update : (params) ->
			$.ajax
				url: '/updateUser'
				type: 'post'
				contentType: "application/json"
				dataType: 'json'
				data: JSON.stringify(params)
		create : (params) ->
			$.ajax
				url: '/createUser'
				type: 'post'
				contentType: "application/json"
				dataType: 'json'
				data: JSON.stringify(params)
	,{}
