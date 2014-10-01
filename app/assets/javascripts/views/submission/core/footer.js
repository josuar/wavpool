WavPool.Views.SubmissionCoreFooter = Backbone.View.extend({
  template: JST['submission/core/footer'],
  className: 'footer',
  
  initialize: function (options) {
    this.showButtonText = options.showButtonText;
    this.listenTo(this.model, "change:likes", this.render);
  },
  
  render: function () {
    var rendered = this.template({
      submission: this.model
    });
    
    this.$el.html(rendered);
    
    return this;
  }
});