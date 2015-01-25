'use strict'

define ['can', 'models/isvModels'], (can, ISVModel) ->
	
	ISV = can.Control.extend

		init : (element, options) ->
			@initControllerOptions()
			@getCurrentISV()
			@renderFormView()

		'#update-isv click' : (el) ->
			if @options.isvMap._id
				@updateISV()
			else
				Helpers.showMessage 'error', 'No hay ISV en la base de datos para actualizar.'

		initControllerOptions : ->
			@options.isvMap = new can.Map
				_id: ''
				value : 0

		renderFormView : ->
			@element.html can.view('views/param/param-isv-edit.mustache',
				isv : @options.isvMap)
			
		getCurrentISV : ->
			self = @
			deferred = ISVModel.findOne()

			deferred.then (response) ->
				if response.success is true
					self.options.isvMap.attr '_id', response.data._id
					self.options.isvMap.attr 'value', response.data.value
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al conseguir actual ISV, favor intentar de nuevo.'

		updateISV : ->
			self = @
			deferred = ISVModel.update(@options.isvMap.serialize())

			deferred.then (response) ->
				if response.success is true
					Helpers.showMessage 'success', 'ISV actualizado exitosamente'
				else
					Helpers.showMessage 'error', response.errorMessage
			, (xhr) ->
				Helpers.showMessage 'error', 'Error al actualizar ISV, favor intentar de nuevo.'

		destroy : ->
			can.Control.prototype.destroy.call @
