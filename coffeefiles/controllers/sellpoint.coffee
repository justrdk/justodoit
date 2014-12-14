'use strict'

define ['can', 'components/sellpointComponents'], (can) ->

	SellPoint = can.Control.extend

		init : (element, options) ->

			@options.searchProducts  = can.compute(new can.List([]))
			@options.orderProducts = can.compute(new can.List([]))
			@element.html can.view('views/sellpoint/sellpoint-layout.mustache', {
					products : @options.searchProducts
					orderProducts: @options.orderProducts
				})

		'.search-inventory keyup' : (el) ->
			self = @
			clearTimeout self.options.searchTimer
			self.options.searchTimer = setTimeout ->
				self.queryProducts(el.val())
			,1200

		'.sellpoint updateOrderDetail' : (el, ev, product) ->
			for prod in @options.orderProducts()
				if prod.CODE is product.CODE
					prod.attr('QUANTITY', prod.attr('QUANTITY') + 1)
					prod.attr('TOTAL', prod.QUANTITY * prod.PRICE)
					return

			@options.orderProducts().push({
					CODE: product.CODE
					NAME: product.NAME
					QUANTITY: 1
					PRICE: product.PRICE
					TOTAL: product.PRICE
				})		
		queryProducts : (query) ->
			#TODO: make request to database and match either code or name of product.
			dummyData = [{
					CODE : 'CU1'
					NAME : 'Cuaderno 3 Materias Copan'
					QUANTITY: 25
					PRICE: 35
					PROVIDER: 'Copan'
				}, {
					CODE : 'LP2'
					NAME : 'Lapiz tinta negro BIC'
					QUANTITY: 15
					PRICE: 12
					PROVIDER: 'BIC'
				},{
					CODE : 'CU2'
					NAME : 'Cuaderno 2 Materias Copan'
					QUANTITY: 2
					PRICE: 20
					PROVIDER: 'Copan'
				},{
					CODE : 'BORR1'
					NAME : 'Borrador'
					QUANTITY: 5
					PRICE: 10
					PROVIDER: 'Borradores'
				}]

			@options.searchProducts().replace(dummyData)

		destroy : ->
			can.Control.prototype.destroy.call @