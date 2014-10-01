WavPool.Views.ProfileShow = Backbone.CompositeView.extend({
  template: JST['profile/show'],
  className: 'profile-full',
  
  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
  },
  
  render: function () {
    var rendered = this.template({
      profile: this.model
    });
    
    this.$el.html(rendered);
    this.attachSubviews();
    
    return this;
  }
});