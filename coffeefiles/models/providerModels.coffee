'use strict'

define ['can'], (can) ->

	ProviderModel = can.Model.extend
		findOne : 'GET /libuniversal/provider/read/{_id}'
		findAll : 'GET /libuniversal/provider/list'
		update : (params) ->
			$.ajax
	            url: '/libuniversal/provider/update'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params) 
		create : (params) ->
			$.ajax
	            url: '/libuniversal/provider/create'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params) 
	,{}