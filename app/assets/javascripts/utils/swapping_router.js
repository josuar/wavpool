Backbone.SwappingRouter = Backbone.Router.extend({
  _swapView: function (view) {    
    if (this._currentView) {
      this._currentView.remove();
    }
    
    this._currentView = view;
    
    this.$rootEl.html(view.render().$el);
  }
});