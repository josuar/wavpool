WavPool.Routers.Router = Backbone.Router.extend({
  routes: {
    "" : "root",
    
    "profiles/:id" : "profileShow",
    // "profile/edit" : "profileEdit",
    //
    // "submissions/new" : "submissionNew",
    "submissions/:id" : "submissionShow",
    // "submissions/:id/edit" : "submissionEdit",
    //
    // "feed" : "feedShow",
    // "surf" : "surfShow"
  },
  
  initialize: function (options) {
    this.$rootEl = options.$rootEl;
  },
  
  root: function () {
    if (WavPool.user) {
      feedShow();
    } else {
      surfShow();
    }
  },
  
  profileShow: function (id) {
    var profile = WavPool.profiles.getOrFetch(id);
    
    var view = new WavPool.Views.ProfileShow({
      model: profile
    });
    
    this.swapView(view);
  },
  
  profileEdit: function () {
    
  },
  
  submissionNew: function () {
    
  },
  
  submissionShow: function (id) {
    var submission = WavPool.submissions.getOrFetch(id);
    
    var view = new WavPool.Views.SubmissionShow({
      model: submission
    });
    
    this.swapView(view);
  },
  
  submissionEdit: function (id) {
    
  },
  
  feedShow: function () {
    
  },
  
  surfShow: function () {
    
  }
});