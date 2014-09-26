WavPool.Collections.Submissions = Backbone.Collection.extend({
  url: "api/submissions",
  
  model: WavPool.Models.Submission,
  
  comparator: function (left, right) {
    var leftDate = new Date(left),
        rightDate = new Date(right);
        
    if (leftDate < rightDate) {
      return -1;
    } else if (leftDate === rightDate) {
      return 0;
    } else {
      return 1;
    }
  }
});

WavPool.submissions = new WavPool.Collections.Submissions();