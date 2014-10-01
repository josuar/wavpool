WavPool.Views.SubmissionShow = Backbone.CompositeView.extend({
  template: JST['submission/show'],
  className: 'submission-full',
  
  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
    
    this._construct();
  },
  
  render: function () {
    var rendered = this.template({
      submission: this.model
    });
    
    this.$el.html(rendered);
    this.attachSubviews(); 
    
    return this;
  },
  
  _construct: function () {
    this.addSubview(
      ".core-container",
      new WavPool.Views.SubmissionCore({ model: this.model })
    );
    
    this.addSubview(
      ".cover-art-container",
      new WavPool.Views.SubmissionCoverArt({ model: this.model })
    );
    
    this.addSubview(
      ".mini-profile-container",
      new WavPool.Views.ProfileMini({ model: this.model.submitter() })
    );
  }
});