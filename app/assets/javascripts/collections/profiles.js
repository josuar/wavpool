WavPool.Collections.Profiles = Backbone.Collection.extend({
  url: '/api/profiles',
  model: WavPool.Models.Profile
});

WavPool.profiles = new WavPool.Collections.Profiles();