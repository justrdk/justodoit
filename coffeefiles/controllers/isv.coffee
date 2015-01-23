'use strict'

define ['can'], (can) ->
	
	ISV = can.Control.extend

		init : (element, options) ->
			@initControllerOptions()
			@renderFormView()

		initControllerOptions : ->
			@options.isv = can.compute(0)

		renderFormView : ->
			@element.html can.view('views/param/param-isv-edit.mustache',
				isv : @options.isv)
		destroy : ->
			can.Control.prototype.destroy.call @
