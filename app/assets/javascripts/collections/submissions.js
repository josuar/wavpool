WavPool.Collections.Submissions = Backbone.Collection.extend({
  url: "api/submissions",
  
  model: WavPool.Models.Submission,
  
  comparator: function (submission) {
    return -submission.id;
  }
});

WavPool.submissions = new WavPool.Collections.Submissions();