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
			subtotal : 0
			tax: 0
			taxPercentage : 1.12
			total : 0
			cashPaid: 0
			cashChange : 0

			increaseProductQuantity : (product, el) ->
				newQuantity = product.attr('QUANTITY') + 1
				@updateQuantityAndTotal(product, newQuantity)

				if product.QUANTITY_INVENTORY > 0
					product.attr('QUANTITY_INVENTORY', product.QUANTITY_INVENTORY - 1)
					can.$('.sellpoint').trigger('decreaseTableQuantity', product)
					@calculateSubtotal(product)

			decreaseProductQuantity : (product, el) ->
				if product.attr('QUANTITY') > 0
					newQuantity = product.attr('QUANTITY') - 1
					product.attr('QUANTITY_INVENTORY', product.QUANTITY_INVENTORY + 1)
					if newQuantity is 0
						@removeProductFromOrder(product)
					else
						@updateQuantityAndTotal(product, newQuantity)
				can.$('.sellpoint').trigger('increaseTableQuantity', product)
				@calculateSubtotal(product)

			removeProductFromOrder : (product) ->
				productIndex = @attr('orderproducts').indexOf(product)
				@attr('orderproducts').splice(productIndex, 1)

			updateQuantityAndTotal : (product, newQuantity) ->
				product.attr('QUANTITY', newQuantity)
				product.attr('TOTAL', newQuantity * product.PRICE)

			calculateSubtotal : (product) ->
				subtotal = 0
				for product in @attr('orderproducts')
					subtotal += product.TOTAL
				@attr('subtotal', subtotal)

		helpers:
			roundTwoDecimalPlaces : (value) ->
				parseFloat(Math.round(value()*100)/100).toFixed(2)
		events:
			'{orderproducts} change' : (el , ev, attr, how, newVal, oldVal) ->
				if how isnt 'remove'
					@scope.calculateSubtotal(newVal[0])
