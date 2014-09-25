WavPool.Collections.Submissions = Backbone.Collection.extend({
  url: "api/submissions",
  
  model: WavPool.Models.Submission,
  
  initialize: function (models, options) {
    this.profile = options.profile;
  }
});
