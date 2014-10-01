$.ToggleButton = function (el, options) {  
  this.$el = $(el);
  
  this.onState = "on";
  this.offState = "off";
  this.oningState = "oning";
  this.offingState = "offing";
  
  this.followState = options.on ? "on" : "off";
  
  this.onAction = options.onAction;
  this.offAction = options.offAction;

  this.onClass = "" || options.onClass;

  this.onOn = options.onOn;
  this.onOff = options.onOff;

  this.noText = options.noText || false;
  this.buttonStyle = options.buttonStyle || "primary";
  
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
        if (this.onOn) {
          this.onOn();
        }

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

        if (this.onOff) {
          this.onOff();
        }
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
  this.$el.removeClass(this.onClass + " btn-danger btn-" + this.buttonStyle)
  
  if (this.followState === this.offState) {
    this.$el.append($('<span>').addClass("glyphicon glyphicon-" + this.onIcon));
    this.$el.addClass("btn-" + this.buttonStyle);

    if (!this.noText) {
      this.$el.append(" " + this.onAction);
    }
  } else {
    this.$el.append(
      $('<span>').addClass(this.onClass + " glyphicon glyphicon-" + this.offIcon)
    );
    this.$el.addClass("btn-danger");

    if (!this.noText) {
      this.$el.append(" " + this.offAction);
    }
  }
  
  this.$el.prop("disabled", false);
};

$.fn.toggleButton = function (options) {
  return this.each(function () {
    new $.ToggleButton(this, options);
  });
};