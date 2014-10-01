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
    var view = new WavPool.Views.SubmissionCore({
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
  
  render: function () {
    var rendered = this.template({
      profile: this.model
    });
    
    this.$el.html(rendered);
    this.attachSubviews();
    
    return this;
  }
});