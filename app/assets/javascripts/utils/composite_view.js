Backbone.CompositeView = Backbone.View.extend({  
  remove: function () {
    Backbone.View.prototype.remove.call(this);
    
    _.each(this.subviews(), function (subviews) {
      _.each(subviews, function (subview) {
        subview.remove();
      });
    });
  },
  
  subviews: function (selector) {
    this._subviews = this._subviews || {};
    
    if (!selector) {
      return this._subviews;
    } else {
      this._subviews[selector] = this._subviews[selector] || [];
      
      return this._subviews[selector];
    }
  },
  
  addSubview: function (selector, subview) {
    this.subviews(selector).push(subview);
    
    this.attachSubview(selector, subview.render());
  },
  
  attachSubview: function (selector, subview) {
    this.$(selector).append(subview.render().$el);

    if (subview.onRender) {
      subview.onRender();
    }
    
    subview.delegateEvents();
    
    if (subview.attachSubviews) {
      subview.attachSubviews();
    }
  },
  
  attachSubviews: function () {
    _.each(this.subviews(), function (subviews, selector) {
      this.$(selector).empty();
      
      _.each(subviews, function (subview) {
        this.attachSubview(selector, subview);
      }.bind(this));
    }.bind(this));
  },
  
  removeSubview: function (selector, subview) {
    subview.remove();
    
    var subviews = this.subviews(selector);
    subviews.splice(subviews.indexOf(subview), 1);
  }
});