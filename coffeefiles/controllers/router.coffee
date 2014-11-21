'use strict'

require ['bootstrap', 'can', 'controllers/header'], (bootstrap, can, Header) ->

    Router = can.Control.extend

        init : (element, options) ->
            new Header(can.$('.top-menu'))
        'route' : (data) ->
            window.location.hash = '#!venta'

        'venta route' : (data) ->
           
        'inventario route' : (data) ->

        'dia route' : (data) ->
            
        'destroyControllers' : ->
            currentControllers = can.$('.main-container').data().controls
            @destroyController controller for controller in currentControllers

        'destroyController' : (controller) ->
            if controller? then controller.destroy()

    $(document).ready ->
        new Router($('body'))
        can.route.ready();