WavPool.Views.ProfileShow = Backbone.CompositeView.extend({
  template: JST['profile/show'],
  className: 'profile-full',
  
  initialize: function () {
    this.listenTo(this.model, "sync", this.render);

    this.listenTo(this.model.submissions(), "add", this.addSubmission);
    this.listenTo(this.model.submissions(), "remove", this.removeSubmission);

    this.model.submissions().each(this.addSubmission.bind(this));
  },

  addSubmission: function (submission) {
    var view = new WavPool.Views.SubmissionInline({
      model: submission
    });

    this.addSubview(".submissions", view);
  },

  removeSubmission: function (submission) {
    var subview = _.find(this.subviews(".submissions"), function (subview) {
      return subview.model === list;
    });
    
    this.removeSubview(".submissions", subview);
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
        followers = this.$(".followed-count");
        followers.text(parseInt(followers.text(), 10) + 1);
      }.bind(this),

      onOff: function () {
        followers = this.$(".followed-count");
        followers.text(parseInt(followers.text(), 10) - 1);
      }.bind(this)
    });
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