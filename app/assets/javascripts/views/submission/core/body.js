WavPool.Views.SubmissionCoreBody = Backbone.View.extend({
  template: JST['submission/core/body'],
  className: 'body',
  
  initialize: function () {
    //this.listenTo(this.model, "sync", this.render);
  },

  render: function () {
    console.log("    body rendering")
    var rendered = this.template({
      submission: this.model
    });
    
    this.$el.html(rendered);
    
    console.log("    body rendered")
    
    return this;
  },
});