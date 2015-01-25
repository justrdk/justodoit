(function() {
  'use strict';
  define(['can', 'models/isvModels'], function(can, ISVModel) {
    var ISV;
    return ISV = can.Control.extend({
      init: function(element, options) {
        this.initControllerOptions();
        this.getCurrentISV();
        return this.renderFormView();
      },
      '#update-isv click': function(el) {
        if (this.options.isvMap._id) {
          return this.updateISV();
        } else {
          return Helpers.showMessage('error', 'No hay ISV en la base de datos para actualizar.');
        }
      },
      getCurrentISV: function() {
        var deferred, self;
        self = this;
        deferred = ISVModel.findOne();
        return deferred.then(function(response) {
          if (response.success === true) {
            self.options.isvMap.attr('_id', response.data._id);
            return self.options.isvMap.attr('value', response.data.value);
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al conseguir actual ISV, favor intentar de nuevo.');
        });
      },
      updateISV: function() {
        var deferred, self;
        self = this;
        deferred = ISVModel.update(this.options.isvMap.serialize());
        return deferred.then(function(response) {
          if (response.success === true) {
            return Helpers.showMessage('success', 'ISV actualizado exitosamente');
          } else {
            return Helpers.showMessage('error', response.errorMessage);
          }
        }, function(xhr) {
          return Helpers.showMessage('error', 'Error al actualizar ISV, favor intentar de nuevo.');
        });
      },
      initControllerOptions: function() {
        return this.options.isvMap = new can.Map({
          _id: '',
          value: 0
        });
      },
      renderFormView: function() {
        return this.element.html(can.view('views/param/param-isv-edit.mustache', {
          isv: this.options.isvMap
        }));
      },
      destroy: function() {
        return can.Control.prototype.destroy.call(this);
      }
    });
  });

}).call(this);
