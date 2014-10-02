WavPool.Views.ProfileShow = Backbone.CompositeView.extend({
  template: JST['profile/show'],
  className: 'profile-full',
  
  initialize: function () {
    this.listenTo(this.model, "sync", this.render);

    this.listenTo(this.model.submissions(), "add", this.addSubmission);
    this.listenTo(this.model.submissions(), "remove", this.removeSubmission);
    
    this.listenTo(this.model.recentLikes(), "add", this.addLike);
    
    this.listenTo(this.model.recentComments(), "add", this.addComment);
    this.listenTo(this.model.recentComments(), "remove", this.removeComment);

    this.model.submissions().each(this.addSubmission.bind(this));
    this.model.recentLikes().each(this.addLike.bind(this));
    this.model.recentComments().each(this.addComment.bind(this));
  },

  addSubmission: function (submission) {
    var view = new WavPool.Views.SubmissionInline({
      model: submission
    });

    this.addSubview(".submissions", view);
  },

  removeSubmission: function (submission) {
    var subview = _.find(this.subviews(".submissions"), function (subview) {
      return subview.model === submission;
    });
    
    this.removeSubview(".submissions", subview);
  },
  
  addLike: function (submission) {
    var view = new WavPool.Views.SubmissionMini({
      model: submission
    });

    this.addSubview(".recent-likes", view);
  },
  
  addComment: function (comment) {
    var view = new WavPool.Views.CommentMini({
      model: comment
    });

    this.addSubview(".recent-comments", view);
  },
  
  removeComment: function (comment) {
    var subview = _.find(this.subviews(".recent-comments"), function (subview) {
      return subview.model === comment;
    });
    
    this.removeSubview(".recent-comments", subview);
  },
  
  onAfterRender: function () {
    this.$('.follow-button').toggleButton({      
      onAction: "Follow",
      offAction: "Unfollow",
      
      on: this.model.get("followed"),
      
      onIcon: "plus",
      offIcon: "minus",
      
      actionUrl: "api/profiles/" + this.model.id + "/follow",

      onOn: function () {
        // followers = this.$(".followed-count");
        // followers.text(parseInt(followers.text(), 10) + 1);
      }.bind(this),

      onOff: function () {
        // followers = this.$(".followed-count");
        // followers.text(parseInt(followers.text(), 10) - 1);
      }.bind(this)
    });
    
    this.$('.submissions').infiniteLoader(
      this.model.apiUrl(), 
      "submissions",
      function (data) {
        this.model.submissions().add(data.submissions);
      }.bind(this)
    );
  },
  
  render: function () {
    var rendered = this.template({
      profile: this.model
    });
    
    this.$el.html(rendered);
    this.attachSubviews();
    
    return this;
  }
});