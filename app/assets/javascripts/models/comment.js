WavPool.Models.Comment = Backbone.Model.extend({
  initialize: function (options) {
    this.submission = options.submission;
  }
});