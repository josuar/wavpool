WavPool.Views.FeedShow = Backbone.CompositeView.extend({
	template: JST["feed/show"],
  
  className: "feed",

	initialize: function () {    
    this.listenTo(this.model, "sync", this.render);
    
    this.listenTo(this.model.submissions(), "add", this.addSubmission);
    this.listenTo(this.model.submissions(), "remove", this.removeSubmission);
    
    this.listenTo(this.model.recentLikes(), "add", this.addLike);
    this.listenTo(
      this.model.recommendedUsers(),
      "add",
      this.addRecommendedUser
    );
    
    this.model.submissions().each(this.addSubmission.bind(this));    
    this.model.recentLikes().each(this.addLike.bind(this));
    this.model.recommendedUsers().each(this.addRecommendedUser.bind(this));
  },
  
  addRecommendedUser: function (user) {
    var subview = new WavPool.Views.ProfileMini({
      model: user
    });
    
    this.addSubview(".recommended-users", subview);
  },
  
  addSubmission: function (submission) {
    var subview = new WavPool.Views.SubmissionInline({
      model: submission,
      showDescription: false,
      showProfile: true
    });
    
    this.addSubview(".submissions", subview);
  },
  
  removeSubmission: function (list) {
    var subview = _.find(this.subviews(".submissions"), function (subview) {
      return subview.model === list;
    });
    
    this.removeSubview(".submissions", subview)
  },
  
  addLike: function (submission) {
    var view = new WavPool.Views.SubmissionMini({
      model: submission
    });

    this.addSubview(".recent-likes", view);
  },
  
  onAfterRender: function () {
    $('.all-content').infiniteLoader(
      this.model.urlRoot, 
      "submissions",
      function (data) {
        this.model.submissions().add(data.submissions);
      }.bind(this)
    );
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