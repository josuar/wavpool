WavPool.Collections.Submissions = Backbone.Collection.extend({
  url: '/api/submissions',
  model: WavPool.Models.Submission
});

WavPool.submissions = new WavPool.Collections.Submissions();