'use strict'

define ['can'], (can) ->

	ProviderModel = can.Model.extend
		id: 'id'
		create : (params) ->
			$.ajax
	            url: '/libuniversal/provider/create'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params)
	,{}