'use strict'

define ['can'], (can) ->

    Header = can.Control.extend
        init : (element, options) ->
        	
    	destroy : ->
    		can.Control.prototype.destroy.call @
