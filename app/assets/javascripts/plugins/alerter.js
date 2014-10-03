$.fn.alerter = function () {
  if (this.length > 1) {
    this.each(function() {
      $(this).alerter()
    });

    return this;
  }

  var $el = $(this);
  var deferred = [];

  this.flashNow = function (alert) {
    $el.append(buildAlertEl(alert));
  };

  this.flash = function (alert) {
    deferred.push(alert);
  };

  this.renderDeferred = function () {
    _(deferred).each(function (alert) {
      this.flashNow(alert);
    }.bind(this));

    deferred = [];
  }.bind(this);

  var buildAlertEl = function (alert) {
    var $alert = $('<div>').
      addClass("alert alert-dismissable alert-" + alert.context).
      text(alert.message);

    var $button = $('<button>').
      addClass("close").
      attr("data-dismiss", "alert");

    $button.append($("<span>").text("×"));
    $alert.append($button);
    
    return $alert;
  };

  return this;
};
