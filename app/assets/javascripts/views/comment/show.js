WavPool.Views.CommentShow = Backbone.View.extend({
	template: JST["comment/show"],
  
  className: "comment",

	initialize: function () {    
    this.listenTo(this.model, "sync", this.render);
  },

  render: function () {    
    var renderedContent = this.template({
      comment: this.model
    });
    
    this.$el.html(renderedContent);

    return this;
  }
});