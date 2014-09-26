WavPool.Routers.Router = Backbone.SwappingRouter.extend({
  routes: {    
    "profiles/:id" : "profileShow",
    "profile/edit" : "profileEdit",
    
    "submissions/new" : "submissionNew"
  },

  initialize: function (options) {
    this.$rootEl = options.$rootEl;
  },
  
  root: function () {
    this.profileShow(WavPool.profile.id);
  },
  
  submissionNew: function () {
    var view = new WavPool.Views.SubmissionForm({
      model: new WavPool.Models.Submission(),
      collection: WavPool.profile.submissions()
    });

    this._swapView(view);
  },

  profileShow: function (id) {
    var profile = WavPool.profiles.getOrFetch(id);

    var view = new WavPool.Views.ProfileShow({
    	model: profile
    });

    this._swapView(view);
  },
  
  profileEdit: function () {
    if (!WavPool.profile) {
      WavPool.alert({
        context: "warning",
        message: "You must be signed in to do that."
      });
      
      return;
    }
    
    var profile = WavPool.profile;
    profile.fetch();
    
    var view = new WavPool.Views.ProfileEdit({
      model: profile
    });
    
    this._swapView(view);
  }
});