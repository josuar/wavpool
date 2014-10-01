WavPool.Views.ProfileMini = Backbone.View.extend({
  template: JST['profile/mini'],
  className: 'profile-mini',
  
  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
  },
  
  render: function () {
    var rendered = this.template({
      profile: this.model
    });
    
    this.$el.html(rendered);
    
    return this;
  }
});