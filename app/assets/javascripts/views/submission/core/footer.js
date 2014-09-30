WavPool.Views.SubmissionCoreFooter = Backbone.View.extend({
  template: JST['submission/core/footer'],
  className: 'footer',
  
  initialize: function (options) {
    this.showButtonText = options.showButtonText || false;
    
    this.listenTo(this.model, "sync", this.render);
  },
  
  render: function () {
    var rendered = this.template({
      submission: this.model,
      buttonText: this.showButtonText
    });
    
    this.$el.html(rendered);
    
    return this;
  }
});