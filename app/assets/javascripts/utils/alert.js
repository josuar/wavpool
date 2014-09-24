WavPool.Views.Alert = Backbone.View.extend({
  set: function (alert) {
    this._alerts().append(
      $('<div>').addClass("alert alert-" + alert.context).text(alert.message)
    );
  },
  
  clear: function () {
    $('.inline-alerts').empty();
    $('.alerts').empty();
  },
  
  _alerts: function () {
    var $inlineAlerts = $('.inline-alerts'); 
    return $inlineAlerts.length ? $inlineAlerts : $('.alerts');
  }
});