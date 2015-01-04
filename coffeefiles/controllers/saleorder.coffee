'use strict'

define ['can', 'components/saleorderComponents', 'models/saleorderModels'], 
(can, saleOrderComponent, SaleOrderModel) ->

	SaleOrder = can.Control.extend

		init : (element, options) ->

			@options.searchProducts  = new can.List []
			@options.orderProducts = new can.List []
			@element.html can.view('views/saleorder/saleorder-layout.mustache', {
					products : @options.searchProducts
					orderProducts: @options.orderProducts
				})

		'.search-inventory keyup' : (el) ->
			query = el.val().trim()
			self = @
			clearTimeout self.options.searchTimer
			self.options.searchTimer = setTimeout ->
				if query isnt '' and /\S+/.test(query) is true
					self.getProductsByFilter(query)
			,1200

		'.saleorder updateOrderDetail' : (el, ev, product) ->
			if @productAlreadyInOrder(product) is false 
				@insertProductInOrder product

		'.saleorder createSaleOrder' : (el, ev) ->
			@createSaleOrder()

		productAlreadyInOrder : (product) ->
			for prod in @options.orderProducts
				if prod.code is product.code
					@updateProductQuantityPrice prod
					return true
			return false

		updateProductQuantityPrice : (product) ->
			if product.quantity > 0
				can.batch.start()
				product.attr('quantityToSell', product.quantityToSell + 1)
				product.attr('quantity', product.quantity - 1)
				can.batch.stop()

		insertProductInOrder : (product) ->
			can.batch.start()
			@options.orderProducts.push
					_id: product._id
					code: product.code
					name: product.name
					quantityToSell: 1
					price: product.price
					quantity : product.quantity - 1	
			can.batch.stop()

		getProductsByFilter : (query) ->
			self = @
			deferred = SaleOrderModel.findAll(filter:query)

			deferred.then (response) ->
				if response.success is true
					self.options.searchProducts.replace response
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al buscar productos, favor intentar de nuevo'

		cleanOrder: ->
			while @options.orderProducts.length > 0
				@options.orderProducts.pop()

		createSaleOrder : ->
			self = @
			items = []

			for prod in @options.orderProducts
				items.push
					productId: prod._id
					quantityToSell: prod.quantityToSell

			deferred = SaleOrderModel.create(items:items)

			deferred.then (response) ->
				if response.success
					Helpers.showMessage 'success', 'Orden de venta ingresada exitosamente'
					self.cleanOrder()
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al crear orden de venta, favor intentar de nuevo'

		destroy : ->
			can.Control.prototype.destroy.call @