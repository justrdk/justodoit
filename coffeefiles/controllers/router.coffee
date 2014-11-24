'use strict'

require ['bootstrap', 'can', 'controllers/header',
'controllers/createProduct'], (bootstrap, can, Header, Product) ->

    Router = can.Control.extend

        init : (element, options) ->
            new Header(can.$('.top-menu'))
        'route' : (data) ->
            window.location.hash = '#!venta'
        
        'crearProducto route' : (data) ->
            new Product(can.$('.main-container'))
        'editarProducto' : (data) ->
            
        'editarProducto/:productoid' : (data) ->

        'destroyControllers' : ->
            currentControllers = can.$('.main-container').data().controls
            @destroyController controller for controller in currentControllers

        'destroyController' : (controller) ->
            if controller? then controller.destroy()

    $(document).ready ->
        new Router($('body'))
        can.route.ready()