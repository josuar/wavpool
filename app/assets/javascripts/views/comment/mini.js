WavPool.Views.CommentMini = Backbone.View.extend({
  template: JST['comment/mini'],
  className: 'comment-mini',
  
  initialize: function () {
    this.listenTo(this.model, "sync change", this.render);
  },
  
  render: function () {
    var rendered = this.template({
      comment: this.model
    });
    
    this.$el.html(rendered);
    
    return this;
  }
});