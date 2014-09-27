WavPool.Views.ProfileShow = Backbone.CompositeView.extend({
	template: JST["profile/show"],

	initialize: function () {
    this.listenTo(this.model, "sync", this.render);
    
    this.listenTo(this.model.submissions(), "add", this.addSubmission);
    this.listenTo(this.model.submissions(), "remove", this.removeSubmission);
    
    this.model.submissions().each(this.addSubmission.bind(this));
  },
  
  addSubmission: function (submission) {
    var subview = new WavPool.Views.SubmissionShow({
      model: submission,
      showDescription: false,
      showProfile: false
    });

    this.addSubview(".submissions", subview);
  },
  
  removeSubmission: function (list) {
    var subview = _.find(this.subviews(".submissions"), function (subview) {
      return subview.model === list;
    });
    
    this.removeSubview(".submissions", subview)
  },

  render: function () {    
    var renderedContent = this.template({
      profile: this.model
    });

    this.$el.html(renderedContent);
    this.attachSubviews();
    
    this.$('.follow-button').toggleButton({      
      onAction: "Follow",
      offAction: "Unfollow",
      
      on: this.model.get("followed"),
      
      onIcon: "plus",
      offIcon: "minus",
      
      actionUrl: "api/profiles/" + this.model.get("user_id") + "/follow",

      onOn: function () {
        followers = this.$(".followed-count");
        followers.text(parseInt(followers.text(), 10) + 1);
      }.bind(this),

      onOff: function () {
        followers = this.$(".followed-count");
        followers.text(parseInt(followers.text(), 10) - 1);
      }.bind(this)
    });

    return this;
  }
});