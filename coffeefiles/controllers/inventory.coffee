'use strict'

define ['can', 'components/inventoryComponents'], (can, inventoryComponent) ->

	Inventory = can.Control.extend

		init: (element, options) ->
			@options.dummyInventory = new can.List []
			@getInventory()
			inventoryComponent = can.mustache "<inventory-table products='{products}'></inventory-table>"
			@element.html inventoryComponent(products: @options.dummyInventory)

		getInventory : ->
			dummyData = [{
					CODE : 'CU1'
					NAME : 'Cuaderno 3 Materias Copan'
					QUANTITY: 25
					PROVIDER: 'Copan'
				}, {
					CODE : 'CU1'
					NAME : 'Cuaderno 3 Materias Copan'
					QUANTITY: 25
					PROVIDER: 'Copan'
				},{
					CODE : 'CU1'
					NAME : 'Cuaderno 3 Materias Copan'
					QUANTITY: 25
					PROVIDER: 'Copan'
				},{
					CODE : 'CU1'
					NAME : 'Cuaderno 3 Materias Copan'
					QUANTITY: 25
					PROVIDER: 'Copan'
				},{
					CODE : 'CU1'
					NAME : 'Cuaderno 3 Materias Copan'
					QUANTITY: 25
					PROVIDER: 'Copan'
				}]

			@options.dummyInventory.replace(dummyData)

		destroy: ->
			can.Control.prototype.destroy.call @