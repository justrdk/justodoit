'use strict'

define ['can', 'models/providerModels'], (can, ProviderModel) ->

	Provider = can.Control.extend

		init : (element, options) ->

			@initControllerOptions()
			if @options.edit isnt undefined and @options.edit is true
				@renderEditTemplate()
			else
				@renderCreateTemplate()

		'#create-prov click' : (el) ->
			@createProvider()
			@cleanMaps()
			
		'#delete-prov click' : (el) ->
			if @options.providerEdit._id
				@deleteProvider()
			else
				Helpers.showMessage 'warning', 'No hay proveedores seleccionados para borrar!'
		'#update-prov click' : (el) ->
			if @options.providerEdit._id
				@updateProvider()
			else
				Helpers.showMessage 'warning', 'No hay proveedores seleccionados para actualizar!'

		'#cancel-prov click' : (el) ->
			@cleanMaps()

		'.typeahead typeahead:autocompleted' : (el, ev, obj, dataset) ->
			el.typeahead 'close'
			@getProviderDetails obj._id

		'.typeahead typeahead:selected' : (el, ev, obj, dataset) ->
			@getProviderDetails obj._id

		initControllerOptions : ->
			@options.providersList = new can.List []
			@options.provider = new can.Map
				name : ''
				address : ''
				phoneNumber : ''
				contact : ''

			@options.providerEdit = new can.Map
				_id : ''
				name : ''
				address : ''
				phoneNumber : ''
				contact : ''

		renderCreateTemplate : ->
			@element.html can.view('views/param/param-provider.mustache', 
					provider : @options.provider)

		renderEditTemplate : ->
			self = @
			can.when(@getAllProviders()).then ->
				if can.route.attr('proveedorid') isnt undefined
					self.getProviderDetails can.route.attr('proveedorid')
				self.element.html can.view('views/param/param-provider-edit.mustache',
					provider : self.options.providerEdit)
				self.initSearchAutoComplete()

		initSearchAutoComplete : ->
			self = @
			can.$('.typeahead').typeahead
				hint: true
				highlight: true
			,
				name : 'Proveedores'
				displayKey: 'value'
				source: self.filterProviders self.options.providersList

		filterProviders : (providers) ->
			findMatches = (q, cb) ->
				matches = []
				substrRegex = new RegExp(q, 'i');

				providers.forEach (provider, index) ->
					if substrRegex.test(provider.name) is true
						matches.push 
							value: provider.name
							_id: provider._id
				cb(matches)

		cleanMaps : ->
			@options.provider.attr 'name', ''
			@options.provider.attr 'address', ''
			@options.provider.attr 'phoneNumber', ''
			@options.provider.attr 'contact', ''

			@options.providerEdit.attr '_id', ''
			@options.providerEdit.attr 'name', ''
			@options.providerEdit.attr 'address', ''
			@options.providerEdit.attr 'phoneNumber', ''
			@options.providerEdit.attr 'contact', ''

		createProvider : ->
			deferred = ProviderModel.create(@options.provider.serialize())

			deferred.then (response) ->
				if response.success is true
					Helpers.showMessage 'success', 'Proveedor creado exitosamente'
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al crear proveedor, favor intentar de nuevo'

		updateProvider : ->
			self = @
			deferred = ProviderModel.update(@options.providerEdit.serialize())

			deferred.then (response) ->
				if response.success is true
					Helpers.showMessage 'success', 'Proveedor actualizado exitosamente'
					self.cleanMaps()
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al actualizar proveedor, favor intentar de nuevo'

		deleteProvider : ->
			self = @
			deferred = ProviderModel.destroy(_id:@options.providerEdit._id)

			deferred.then (response) ->
				if response.success is true
					Helpers.showMessage 'success', 'Proveedor borrado exitosamente'
					self.cleanMaps()
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al intentar borrar proveedor, favor intentar de nuevo'
		getAllProviders : ->
			self = @
			deferred = ProviderModel.findAll({})

			deferred.then (response) ->
				if response.success is true
					self.options.providersList.replace response
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error consiguiendo lista de proveedores, favor intentar de nuevo'

			deferred
			
		getProviderDetails : (providerId)->
			self = @
			deferred = ProviderModel.findOne(_id:providerId)	

			deferred.then (response) ->
				if response.success is true
					self.options.providerEdit.attr '_id', response.data._id
					self.options.providerEdit.attr 'name', response.data.name
					self.options.providerEdit.attr 'address', response.data.address
					self.options.providerEdit.attr 'phoneNumber', response.data.phoneNumber
					self.options.providerEdit.attr 'contact', response.data.contact
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al traer detalles de proveedor, favor intentar de nuevo'

		destroy : ->
			can.$('typeahead').typeahead 'destroy'
			can.Control.prototype.destroy.call @