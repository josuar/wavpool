Backbone.Collection.prototype.getOrFetch = function (id) {
  var model = this.get(id);
  
  if (model) {
    model.fetch();
  } else {
    model = new this.model({ id: id });
    
    model.fetch({
      success: function () {
        this.add(model);        
      }.bind(this)
    });
  }
  
  return model;
};

Backbone.Router.prototype.swapView = function (view) {    
  if (this._currentView) {
    this._currentView.remove();
  }
  
  this._currentView = view;
  
  this.$rootEl.html(view.render().$el);
};