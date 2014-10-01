WavPool.Models.Comment = Backbone.Model.extend({
  urlRoot: 'api/comments',
  
  profile: function () {
    this._profile = this._profile ||
      new WavPool.Models.Profile();
      
    return this._profile;
  },
  
  parse: function (payload) {
    if (payload.profile) {
      this.profile().set(payload.profile, { parse: true } );
      delete payload.profile;
    }
    
    return payload;
  }
});