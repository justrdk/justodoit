'use strict'

define ['can', 'models/productModels', 'models/providerModels'], (can,  ProductModel, ProviderModel) ->

	Product = can.Control.extend

		init : (element, options) ->
			self  = @
			@initControllerOptions()

			can.when(@getProductProviders()).then (response) ->
				if self.options.edit isnt undefined and self.options.edit is true
					self.renderEditTemplate()
				else
					self.renderCreateTemplate()
			
		'#create-prod click' : (el) ->
			@createProduct()

		'#delete-prod click' : (el) ->
			if @productSelected() is true
				@deleteProduct()
			else
				Helpers.showMessage 'warning', 'No hay productos seleccionados para borrar!'

		'#update-prod click' : (el) ->
			if @productSelected() is true
				@updateProduct()
			else
				Helpers.showMessage 'warning', 'No hay productos seleccionados para actualizar!'

		'#cancel-prod click' : (el) ->
			@cleanMaps()

		'.typeahead typeahead:autocompleted' : (el, ev, obj, dataset) ->
			el.typeahead 'close'
			@getProductDetails obj._id

		'.typeahead typeahead:selected' : (el, ev, obj, dataset) ->
			@getProductDetails obj._id

		initControllerOptions : ->
			@options.product = new can.Map
				code : ''
				name : ''
				price : 0
				quantity : 0
				provider : ''
				threshold : 0

			@options.productEdit = new can.Map
				_id : ''
				code : ''
				name : ''
				price : 0
				quantity : 0
				provider : ''
				threshold : 0

			@options.productsList = new can.List []
			@options.productProviders = new can.List []

		cleanMaps : ->
			@options.product.attr 'code', ''
			@options.product.attr 'name', ''
			@options.product.attr 'price', 0
			@options.product.attr 'quantity', 0
			@options.product.attr 'provider', ''
			@options.product.attr 'threshold', 0

			@options.productEdit.attr '_id', ''
			@options.productEdit.attr 'code', ''
			@options.productEdit.attr 'name', ''
			@options.productEdit.attr 'price', 0
			@options.productEdit.attr 'quantity', 0
			@options.productEdit.attr 'provider', ''
			@options.productEdit.attr 'threshold', 0

		productSelected : ->
			if @options.productEdit._id
				true
			else
				false
	
		renderCreateTemplate : ->
			@element.html can.view('views/param/param-product.mustache', 
					product : @options.product
					providers : @options.productProviders)

		renderEditTemplate : ->
			self = @
			can.when(@getAllProducts()).then ->
				if can.route.attr('productoid') isnt undefined
					self.getProductDetails can.route.attr('productoid')
				self.element.html can.view('views/param/param-product-edit.mustache', 
					product : self.options.productEdit
					providers : self.options.productProviders)
				self.initSearchAutoComplete()

		initSearchAutoComplete : ->
			self = @
			can.$('.typeahead').typeahead
				hint: true
				highlight: true
			,
				name : 'Productos'
				displayKey: 'value'
				source: self.filterProducts()

		filterProducts : ->
			self = @
			findMatches = (q, cb) ->
				matches = []
				products = self.options.productsList
				substrRegex = new RegExp(q, 'i')

				products.forEach (product, index) ->
					if substrRegex.test(product.code) is true or substrRegex.test(product.name) is true
						matches.push 
							value: product.name
							_id: product._id
				cb(matches)

		updateProductInList : ->
			self = @
			idToCompare = self.options.productEdit._id
			@options.productsList.map (product) ->
				if product._id is idToCompare
					product.attr 'name', self.options.productEdit.name

		removeProductInList : ->
			for product, index in @options.productsList
				if product._id is @options.productEdit._id
					@options.productsList.splice index, 1
					break

		createProduct : ->
			self = @
			deferred = ProductModel.create(@options.product.serialize())

			deferred.then (response) ->
				if response.success is true
					Helpers.showMessage 'success', 'Producto creado exitosamente'
					self.cleanMaps()
				else
					Helpers.showMessage 'error', 'Error al crear producto, favor intentar de nuevo'
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al crear producto, favor intentar de nuevo'

		updateProduct : ->
			self = @
			deferred = ProductModel.update(@options.productEdit.serialize())

			deferred.then (response) ->
				if response.success is true
					Helpers.showMessage 'success', 'Producto actualizado exitosamente'
					self.updateProductInList()
					self.cleanMaps()
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al actualizar producto, favor intentar de nuevo'

		deleteProduct : ->
			self = @
			deferred = ProductModel.destroy(_id:@options.productEdit._id)

			deferred.then (response) ->
				if response.success is true
					Helpers.showMessage 'success', 'Producto borrado exitosamente'
					self.removeProductInList()
					self.cleanMaps()
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al intentar borrar producto, favor intentar de nuevo'

		getAllProducts : ->
			self = @
			deferred = ProductModel.findAll({})

			deferred.then (response) ->
				if response.success is true
					self.options.productsList.replace response
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error consiguiendo lista de productos, favor intentar de nuevo'

			deferred

		getProductProviders : ->
			self = @
			deferred = ProviderModel.findAll({})

			deferred.then (response) ->
				if response.success is true
					self.options.productProviders.replace response
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error consiguiendo lista de proveedores, favor intentar de nuevo'

			deferred

		getProductDetails : (productId) ->
			self = @
			deferred = ProductModel.findOne(_id:productId)

			deferred.then (response) ->
				if response.success is true
					self.options.productEdit.attr '_id', response.data._id
					self.options.productEdit.attr 'code', response.data.code
					self.options.productEdit.attr 'name', response.data.name
					self.options.productEdit.attr 'price', response.data.price
					self.options.productEdit.attr 'quantity', response.data.quantity
					self.options.productEdit.attr 'provider', response.data.provider
					self.options.productEdit.attr 'threshold', response.data.threshold
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al traer detalles de producto, favor intentar de nuevo'

		destroy : ->
			can.$('typeahead').typeahead 'destroy'
			can.Control.prototype.destroy.call @