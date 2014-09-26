$.ToggleButton = function (el, options) {  
  this.$el = $(el);
  
  this.onState = "on";
  this.offState = "off";
  this.oningState = "oning";
  this.offingState = "offing";
  
  this.followState = options.on ? "on" : "off";
  
  this.onAction = options.onAction;
  this.offAction = options.offAction;
  
  this.onIcon = options.onIcon;
  this.offIcon = options.offIcon;
  
  this.actionUrl = options.actionUrl;
  
  this.render();
  this.$el.on("click", this.handleClick.bind(this));
};

$.ToggleButton.prototype.handleClick = function (event) {
  event.preventDefault();
  
  if (this.followState === this.offState) {
    $.ajax({
      url: this.actionUrl,
      type: "POST",
      dataType: "JSON",
      success: function () {
        this.followState = this.onState;
        this.render();
      }.bind(this)
    });
    
    this.followState = this.oningState;
    this.render();
  } else {
    $.ajax({
      url: this.actionUrl,
      type: "DELETE",
      dataType: "JSON",
      success: function () {
        this.followState = this.offState;
        this.render();
      }.bind(this)
    });
    
    this.followState = this.offingState;
    this.render();
  }
};

$.ToggleButton.prototype.render = function () {
  var acting = this.followState === this.oningState || 
    this.followState === this.offingState;
    
  if (acting) {
    this.$el.prop("disabled", true);
    return;
  }
  
  this.$el.empty();
  this.$el.removeClass("btn-primary btn-danger")
  
  if (this.followState === this.offState) {
    this.$el.append($('<span>').addClass("glyphicon glyphicon-" + this.onIcon));
    this.$el.append(" " + this.onAction).addClass("btn-primary");
  } else {
    this.$el.append(
      $('<span>').addClass("glyphicon glyphicon-" + this.offIcon)
    );
    this.$el.append(" " + this.offAction).addClass("btn-danger");
  }
  
  this.$el.prop("disabled", false);
};

$.fn.toggleButton = function (options) {
  return this.each(function () {
    new $.ToggleButton(this, options);
  });
};