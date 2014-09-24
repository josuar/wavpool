WavPool.Collections.Profiles = Backbone.Collection.extend({
  url: '/api/profiles',
  model: WavPool.Models.Profile,
  
  getOrFetch: function (id) {
    var profile = this.get(id);
    
    if (profile) {
      profile.fetch();
    } else {
      profile = new Profile({ id: id });
      
      profile.fetch({
        success: function () {
          this.add(profile);
        }.bind(this)
      });
    }
    
    return profile;
  }
});

WavPool.profiles = new WavPool.Collections.Profiles();