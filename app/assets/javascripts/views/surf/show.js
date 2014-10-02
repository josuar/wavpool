WavPool.Views.SurfShow = Backbone.CompositeView.extend({
	template: JST["surf/show"],
  
  className: "surf",

	initialize: function () {    
    this.listenTo(this.model, "sync", this.render);
    
    this.listenTo(this.model.submissions(), "add", this.addSubmission);
    this.listenTo(this.model.submissions(), "remove", this.removeSubmission);
    
    this.model.submissions().each(this.addSubmission.bind(this));    
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

  render: function () {    
    var renderedContent = this.template({
      feed: this.model
    });
    
    this.$el.html(renderedContent);
    this.attachSubviews();

    return this;
  }
});