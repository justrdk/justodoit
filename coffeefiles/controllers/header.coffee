'use strict'

define ['can','components/headerComponents'], (can, headerComponent) ->

	Header = can.Control.extend

		init : (element, options) ->
			@element.html can.view('views/shared/header.mustache')
		destroy : ->
			can.Control.prototype.destroy.call @