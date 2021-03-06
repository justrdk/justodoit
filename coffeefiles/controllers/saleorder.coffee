'use strict'

define ['can', 'components/saleorderComponents', 'models/saleorderModels', 'models/productModels'],
(can, saleOrderComponent, SaleOrderModel, ProductModel) ->

	SaleOrder = can.Control.extend

		init : (element, options) ->
			self = @
			@options.searchProducts  = new can.List []
			@options.orderProducts = new can.List []
			@options.products = new can.List []

			@getAllProducts().then ->
				self.element.html can.view('views/saleorder/saleorder-layout.mustache', {
						products : self.options.searchProducts
						orderProducts: self.options.orderProducts
					})

		'.search-inventory keyup' : (el) ->
			query = el.val().trim()
			self = @
			clearTimeout self.options.searchTimer
			self.options.searchTimer = setTimeout ->
				if query isnt '' and /\S+/.test(query) is true
					self.getProductsByFilter(query)
				else
					self.options.searchProducts.replace []
			,1200

		'.saleorder updateOrderDetail' : (el, ev, product) ->
			if @productAlreadyInOrder(product) is false
				@insertProductInOrder product

		'.saleorder createSaleOrder' : (el, ev, discount) ->
			@createSaleOrder(discount)

		getAllProducts : ->
			self =  @
			deferred = ProductModel.findAll()

			deferred.then (response) ->
				if response.success
					self.options.products.replace response
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				if xhr.status is 403
					Helpers.showMessage 'error', 'Su usuario no tiene privilegios para acceder a esta informacion'
				else
					Helpers.showMessage 'error', 'Error al crear orden de venta, favor intentar de nuevo'

			deferred

		productAlreadyInOrder : (product) ->
			for prod in @options.orderProducts
				if prod.code is product.code
					#@updateProductQuantityPrice prod
					return true
			return false

		updateProductQuantityPrice : (product) ->
			if product.quantity > 0
				product.attr('quantityToSell', product.quantityToSell + 1)

		insertProductInOrder : (product) ->
			can.batch.start()
			@options.orderProducts.push
					_id: product._id
					code: product.code
					name: product.name
					quantityToSell: 1
					price: product.price
					quantity : product.quantity
			can.batch.stop()

		getProductsByFilter : (query) ->
			self = @
			substrRegex = new RegExp(query, 'i')

			@options.products.forEach (product, index) ->
				if substrRegex.test(product.code) is true or substrRegex.test(product.name) is true
					dups = self.options.searchProducts.filter (prod) ->
							prod._id is product._id
					if dups.length is 0 then self.options.searchProducts.push product

		cleanOrder: ->
			for prod in @options.products
				for orderProd in @options.orderProducts
					if prod._id is orderProd._id
						prod.attr('quantity', orderProd.quantity)

			@options.orderProducts.replace []
			$('order-products').scope().attr('validSale', false)

		createSaleOrder : (discount) ->
			self = @
			items = []

			items.push {productId: prod._id, quantityToSell: prod.quantityToSell, quantityInventory: prod.quantity} for prod in @options.orderProducts
			deferred = SaleOrderModel.create(
				items: items
				discount: discount)

			deferred.then (response) ->
				if response.success
					Helpers.showMessage 'success', 'Orden de venta ingresada exitosamente'
					self.cleanOrder()
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				if xhr.status is 403
					Helpers.showMessage 'error', 'Su usuario no tiene privilegios para acceder a esta informacion'
				else
					Helpers.showMessage 'error', 'Error al crear orden de venta, favor intentar de nuevo'

		destroy : ->
			can.Control.prototype.destroy.call @
