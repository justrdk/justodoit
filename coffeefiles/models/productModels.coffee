'use strict'

define ['can'], (can) ->

	ProductModel = can.Model.extend
		findOne : 'GET /getProduct/{_id}'
		findAll : 'GET /getProducts'
		destroy : (params) ->
			$.ajax
				url: '/deleteProduct'
				type: 'post'
				contentType: "application/json"
				dataType: 'json'
				data: JSON.stringify(params)
		update : (params) ->
			$.ajax
				url: '/updateProduct'
				type: 'post'
				contentType: "application/json"
				dataType: 'json'
				data: JSON.stringify(params)
		create : (params) ->
			$.ajax
				url: '/createProduct'
				type: 'post'
				contentType: "application/json"
				dataType: 'json'
				data: JSON.stringify(params)
	,{}
