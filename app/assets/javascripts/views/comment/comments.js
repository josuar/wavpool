WavPool.Views.Comments = Backbone.CompositeView.extend({
	template: JST["comment/comments"],
  
  className: "comments-list",

	initialize: function () {    
    this.listenTo(this.model, "sync", this.render);
    
    this.listenTo(this.model.comments(), "add", this.addComment);
    this.listenTo(this.model.comments(), "remove", this.removeComment);
    
    this.model.comments().each(this.addComment.bind(this));
  },
  
  addComment: function (comment) {
    var view = new WavPool.Views.CommentShow({
      model: comment
    });

    this.addSubview(".comments", view);
  },

  removeComment: function (comment) {
    var subview = _.find(this.subviews(".comments"), function (subview) {
      return subview.model === comment;
    });
    
    this.removeSubview(".comments", subview);
  },

  render: function () {    
    var renderedContent = this.template({
      feed: this.model
    });
    
    this.$el.html(renderedContent);
    this.attachSubviews();

    return this;
  }
});