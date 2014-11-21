'use strict'

require ['bootstrap', 'can'], (bootstrap, can) ->

    Router = can.Control.extend

        init : (element, options) ->
            
        'route' : (data) ->
            window.location.hash = '#!venta'

        'venta route' : (data) ->
           
        'inventario route' : (data) ->
            
        'destroyControllers' : ->
            currentControllers = can.$('.main-container').data().controls
            @destroyController controller for controller in currentControllers

        'destroyController' : (controller) ->
            if controller? then controller.destroy()

    $(document).ready ->
        new Router($('body'))
        can.route.ready();