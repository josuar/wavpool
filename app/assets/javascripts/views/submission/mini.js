WavPool.Views.SubmissionMini = Backbone.View.extend({
  template: JST['submission/mini'],
  className: 'submission-mini',
  
  initialize: function () {
    this.listenTo(this.model, "sync change", this.render);
  },
  
  render: function () {
    var rendered = this.template({
      submission: this.model
    });
    
    this.$el.html(rendered);
    
    return this;
  }
});