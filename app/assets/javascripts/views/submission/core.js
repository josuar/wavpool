WavPool.Views.SubmissionCore = Backbone.CompositeView.extend({
  template: JST['submission/core'],
  className: 'core',
  
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
  
  onAfterRender: function () {
    // bind jQuery plugins, etc.
  },
  
  _construct: function () {    
    this.addSubview(
      '.header-container',
      new WavPool.Views.SubmissionCoreHeader({ model: this.model })
    );
    
    this.addSubview(
      '.body-container',
      new WavPool.Views.SubmissionCoreBody({ model: this.model })
    );
    
    this.addSubview(
      '.footer-container',
      new WavPool.Views.SubmissionCoreFooter({
        model: this.model,
        showButtonText: true
      })
    );
  }
});