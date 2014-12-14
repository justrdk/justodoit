'use strict'

define ['can'], (can) ->

	can.Component.extend
		tag: 'query-products'
		scope:
			selectProduct : (product, el) ->
				can.$('.sellpoint').trigger('updateOrderDetail', product)

	can.Component.extend
		tag: 'order-detail'
		scope:
			increaseQuantity : (product, el) ->
				console.log 'product', product
			decreaseQuantity : (product, el) ->
				console.log 'product', product