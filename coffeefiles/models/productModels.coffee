'use strict'

define ['can'], (can) ->

	ProductModel = can.Model.extend
		findAll: 'GET /libuniversal/product/list'
		create : (params) ->
			$.ajax
	            url: '/libuniversal/product/create'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params)
	,{}