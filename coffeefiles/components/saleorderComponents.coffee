'use strict'

define ['can'], (can) ->

	can.Component.extend
		tag: 'query-products'
		scope:
			selectProduct : (product, el) ->
				can.$('.saleorder').trigger('updateOrderDetail', product)

	can.Component.extend
		tag: 'order-products'
		scope:
			validSale : false
			subtotal : 0
			tax: 0
			taxPercentage : 0.15
			total : 0
			cashPaid: 0
			cashChange : 0
			timer: 0

			increaseProductQuantity : (product, el) ->
				if product.quantity > 0
					newQuantity = product.attr('quantityToSell') + 1
					@updateProductQuantity product, newQuantity
					product.attr('quantity', product.quantity - 1)
					@calculateSubtotal product
				else
					Helpers.showMessage 'warning', 'Actual cantidad es el maximo en inventario de producto'
	
			decreaseProductQuantity : (product, el) ->
				if product.attr('quantityToSell') > 0
					newQuantity = product.attr('quantityToSell') - 1
					product.attr('quantity', product.quantity + 1)
					if newQuantity is 0
						@removeProductFromOrder product
					else
						@updateProductQuantity(product, newQuantity)
				@calculateSubtotal product

			removeProductFromOrder : (product) ->
				productIndex = @attr('orderproducts').indexOf product
				@attr('orderproducts').splice productIndex, 1

			updateProductQuantity : (product, newQuantity) ->
				product.attr('quantityToSell', newQuantity)

			calculateSubtotal : (product) ->
				subtotal = 0
				for product in @attr('orderproducts')
					subtotal += product.price * product.quantityToSell
				@attr('subtotal', subtotal)

			calculateTax : ->
				@attr('tax', @subtotal * @taxPercentage)

			calculateTotal : ->
				@attr('total', @subtotal + @tax)

			calculateChange : ->
				if @cashPaid >= @total
					@attr('cashChange', @cashPaid - @total)
					@attr('validSale', true)
				else
					@attr('validSale', false)
					@attr('cashChange', @cashPaid - @total)
					Helpers.showMessage 'warning', 'Total a pagar no esta cancelado en su totalidad'

			createSaleOrder : (context, el) ->
				#can.$('.saleorder').trigger('createSaleOrder')

			cancelSaleOrder : ->
				while @orderproducts.length > 0
					@orderproducts.pop()

		helpers:
			roundTwoDecimalPlaces : (value) ->
				parseFloat(Math.round(value()*100)/100).toFixed 2
		events:
			'.cash-paid keyup' : (el) ->
				self = @
				change = el.val().trim()
				clearTimeout @scope.timer
				@scope.attr('timer', setTimeout ->
						if change isnt '' and /\S+/.test(change) is true and isNaN(change) is false
							self.scope.attr('cashPaid', change)
							self.scope.calculateChange()
					, 1100)

			'{orderproducts} change' : (el , ev, attr, how, newVal, oldVal) ->
				if how isnt 'remove'
					@scope.calculateSubtotal newVal[0]
					@scope.calculateTax()
					@scope.calculateTotal()