WavPool.Models.Profile = Backbone.Model.extend({
  urlRoot: '/api/profiles',
  
  submissions: function () {
    this._submissions = this._submissions ||
      new WavPool.Collections.Submissions([], { profile: this });
  },
  
  parse: function (payload) {
    if (payload.submissions) {
      this.submissions().set(payload.submissions, { parse: true} );
      delete payload.submissions;
    }
    
    return payload;
  }
});