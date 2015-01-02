'use strict'

define ['can'], (can) ->

	SaleOrderModel = can.Model.extend
		findAll : 'GET /libuniversal/product/list/{filter}'
		create : (params) ->
			$.ajax
	            url: '/libuniversal/saleorder/create'
	            type: 'post'
	            contentType: "application/json"
	            dataType: 'json'
	            data: JSON.stringify(params)
	,{}