WavPool.Views.SubmissionCoreHeader = Backbone.View.extend({
  template: JST['submission/core/header'],
  className: 'header',
  
  initialize: function () {
    this.listenTo(this.model, "change:title change:display_name", this.render);
  },
  
  render: function () {
    var rendered = this.template({
      submission: this.model
    });
    
    this.$el.html(rendered);
    
    return this;
  }
});