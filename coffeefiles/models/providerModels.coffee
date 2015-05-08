'use strict'

define ['can'], (can) ->

	ProviderModel = can.Model.extend
		findOne : 'GET getProvider/{_id}'
		findAll : 'GET getProviders'
		destroy : (params) ->
			$.ajax
	            url: '/deleteProvider'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params)
		update : (params) ->
			$.ajax
	            url: '/updateProvider'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params)
		create : (params) ->
			$.ajax
	            url: '/createProvider'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params)
	,{}
