WavPool.Views.SubmissionCoreBody = Backbone.View.extend({
  template: JST['submission/core/body'],
  className: 'body',
  
  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
    this.listenTo(this.model.comments(), "add", this.addComment);
  },

  render: function () {
    var rendered = this.template({
      submission: this.model
    });
    
    this.$el.html(rendered);
    
    return this;
  },
});