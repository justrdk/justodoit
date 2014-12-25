'use strict'

define ['can'], (can) ->

	ProductModel = can.Model.extend
		findOne : 'GET /libuniversal/product/read/{_id}'
		findAll : 'GET /libuniversal/product/list'
		destroy : (params) ->
			$.ajax
	            url: '/libuniversal/product/delete'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params) 
		update : (params) ->
			$.ajax
	            url: '/libuniversal/product/update'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params) 
		create : (params) ->
			$.ajax
	            url: '/libuniversal/product/create'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params) 
	,{}