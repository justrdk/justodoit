'use strict'

define ['can'], (can) ->

	can.Component.extend
		tag: 'query-products'
		scope:
			selectProduct : (product, el) ->
				can.$('.sellpoint').trigger('updateOrderDetail', product)

	can.Component.extend
		tag: 'order-products'
		scope:
			increaseProductQuantity : (product, el) ->
				newQuantity = product.attr('QUANTITY') + 1
				product.attr('QUANTITY', newQuantity)
				product.attr('TOTAL', newQuantity * product.PRICE)

			decreaseProductQuantity : (product, el) ->
				if product.attr('QUANTITY') > 0
					newQuantity = product.attr('QUANTITY') - 1
					if newQuantity is 0
						@removeProductFromOrder(product)
					else
						product.attr('QUANTITY', newQuantity)
						product.attr('TOTAL', newQuantity * product.PRICE)

			removeProductFromOrder : (product) ->
				productIndex = @attr('orderproducts').indexOf(product)
				@attr('orderproducts').splice(productIndex, 1)