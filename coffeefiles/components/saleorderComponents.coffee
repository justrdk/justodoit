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
			timer : 0
			discountTimer : 0
			discount : 0

			removeProductFromOrder : (product) ->
				productIndex = @attr('orderproducts').indexOf product
				@attr('orderproducts').splice productIndex, 1
				if @attr('orderproducts').length is 0
					@attr('validSale', false)
				@calculateSubtotal product
				@calculateTotal()

			updateProductQuantity : (product, el) ->
				if product.quantity < product.quantityToSell
					Helpers.showMessage 'warning', 'Cantidad a vender es mayor a cantidad en inventario'
					@attr('validSale', false)
				else if parseInt(product.quantityToSell, 10) is 0
					@removeProductFromOrder product

			calculateSubtotal : (product) ->
				subtotal = 0
				for product in @attr('orderproducts')
					subtotal += product.price * product.quantityToSell
				@attr('subtotal', subtotal)

			validProductQuantity : ->
				valid = true
				valid = false for prod in @attr('orderproducts') when prod.quantity < prod.quantityToSell
				@attr('validSale', valid)

			calculateTax : ->
				@attr('tax', @subtotal * @taxPercentage)

			calculateTotal : ->
				total = (@subtotal + @tax) - @discount
				if total < 0
					@attr('validSale', false)
					Helpers.showMessage 'warning', 'Descuento no puede ser mayor a subtotal'
				else
					@attr('total', total)
					@calculateChange()

			calculateChange : ->
				if @cashPaid >= @total
					@attr('cashChange', @cashPaid - @total)
					@validProductQuantity()
				else
					@attr('validSale', false)
					@attr('cashChange', @cashPaid - @total)
					Helpers.showMessage 'warning', 'Total a pagar no esta cancelado en su totalidad'

			createSaleOrder : (context, el) ->
				product.attr('quantity', product.quantity - product.quantityToSell) for product in @attr('orderproducts')
				can.$('.saleorder').trigger('createSaleOrder', [@discount])

			cancelSaleOrder : ->
				while @orderproducts.length > 0
					@orderproducts.pop()

		events:
			'.cash-paid keyup' : (el) ->
				self = @
				change = el.val().trim()
				clearTimeout @scope.timer
				@scope.attr('timer', setTimeout ->
						if change isnt '' and /\S+/.test(change) is true and isNaN(change) is false
							self.scope.attr('cashPaid', change)
							self.scope.calculateTotal()
					, 1100)

			'.discount keyup' : (el) ->
				self = @
				discount = el.val().trim()
				clearTimeout @scope.discountTimer
				@scope.attr('discountTimer', setTimeout ->
						if discount isnt '' and /\S+/.test(discount) is true and isNaN(discount) is false
							self.scope.attr('discount', discount)
							self.scope.calculateTotal()
					, 1100)

			'{orderproducts} change' : (el , ev, attr, how, newVal, oldVal) ->
				if how isnt 'remove'
					@scope.calculateSubtotal newVal[0]
					@scope.calculateTotal()
		helpers:
			roundTwoDecimalPlaces : (value) ->
				parseFloat(Math.round(value()*100)/100).toFixed 2
