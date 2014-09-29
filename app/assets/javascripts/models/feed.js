WavPool.Models.Feed = Backbone.Model.extend({
  urlRoot: "api/feed",
  
  submissions: function () {
    this._submissions = this._submissions ||
      new WavPool.Collections.Submissions([]);
      
    return this._submissions;
  },
  
  parse: function (payload) {
    if (payload.submissions) {
      this.submissions().set(payload.submissions, { parse: true } );
      delete payload.submissions;
    }
    
    return payload;
  },
});