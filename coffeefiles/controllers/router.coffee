'use strict'

require ['bootstrap', 'can', 'controllers/header',
'controllers/product', 'controllers/provider'], (bootstrap, can, Header, Product, Provider) ->

    Router = can.Control.extend

        init : (element, options) ->
            new Header(can.$('.top-menu'))
        'route' : (data) ->
            window.location.hash = '#!crearProducto'
        
        'crearProducto route' : (data) ->
            @destroyControllers()
            new Product(can.$('.main-container'), edit:false)
        'editarProducto route' : (data) ->
            @destroyControllers()
            new Product(can.$('.main-container'), edit:true)
        'editarProducto/:productoid route' : (data) ->
            @destroyControllers()
            new Product(can.$('.main-container'), edit:true)
        'crearProveedor route' : (data) ->
            @destroyControllers()
            new Provider(can.$('.main-container'), edit:false)
        'editarProveedor route' : (data) ->
            @destroyControllers()
            new Provider(can.$('.main-container'), edit:true)
        'editarProveedor/:proveedorid route' : (data) ->
            @destroyControllers()
            new Provider(can.$('.main-container'), edit:true)
        'destroyControllers' : ->
            currentControllers = can.$('.main-container').data().controls
            if currentControllers isnt undefined
                @destroyController controller for controller in currentControllers

        'destroyController' : (controller) ->
            if controller isnt undefined and controller isnt null
                controller.destroy()

    $(document).ready ->
        new Router($('body'))
        can.route.ready()