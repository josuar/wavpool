WavPool.Views.SubmissionCoverArt = Backbone.View.extend({
  template: JST['submission/core/cover_art'],
  className: 'cover_art',
  
  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
  },
  
  render: function () {
    var rendered = this.template({
      submission: this.model
    });
    
    this.$el.html(rendered);
    
    return this;
  }
});