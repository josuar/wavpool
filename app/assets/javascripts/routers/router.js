WavPool.Routers.Router = Backbone.SwappingRouter.extend({
  routes: {    
    "profiles/:id" : "profileShow",
    "profile/edit" : "profileEdit",
    
    "submissions/new" : "submissionNew"
  },

  initialize: function (options) {
    this.$rootEl = options.$rootEl;
  },
  
  root: function (id) {
    this.$rootEl.html("");
  },
  
  // submissionNew: function () {
  //   var view = new WavPool.Views.SubmissionForm({
  //     model: new WavPool.Models.Submission(),
  //     collection: WavPool.submissions
  //   });
  //
  //   this._swapView(view);
  // },
  
  profileShow: function (id) {
    var profile = WavPool.profiles.getOrFetch(id);

    var view = new WavPool.Views.ProfileShow({
    	model: profile
    });

    this._swapView(view);
  },
  
  profileEdit: function () {
    if (!WavPool.isAuthed) {
      WavPool.alert({
        context: "warning",
        message: "You must be signed in to do that."
      });
      
      return;
    }
    
    var profile = WavPool.profiles.getOrFetch(WavPool.profileId);
    
    var view = new WavPool.Views.ProfileEdit({
      model: profile
    });
    
    this._swapView(view);
  }
});