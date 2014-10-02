WavPool.Routers.Router = Backbone.Router.extend({
  routes: {
    "" : "root",
    
    "profiles/:id" : "profileShow",
    "profile/edit" : "profileEdit",

    "submissions/new" : "submissionNew",
    "submissions/:id" : "submissionShow",
    "submissions/:id/edit" : "submissionEdit",

    "feed" : "feedShow",
    "surf" : "surfShow"
  },
  
  initialize: function (options) {
    this.$rootEl = options.$rootEl;
  },
  
  root: function () {
   if (WavPool.user) {
     this.feedShow();
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
    if (!WavPool.user) {
      WavPool.alerter.flash({
        context: "warning",
        message: "You must be signed in to do that."
      });
      
      return;
    }
    
    var profile = WavPool.user.profile();
    profile.fetch();
    
    var view = new WavPool.Views.ProfileEdit({
      model: profile
    });
    
    this.swapView(view);
  },
  
  submissionNew: function () {
    if (!WavPool.user) {
      WavPool.alerter.flash({
        context: "warning",
        message: "You must be signed in to do that."
      });
      
      return;
    }
    
    var view = new WavPool.Views.SubmissionForm({
      model: new WavPool.Models.Submission(),
      collection: WavPool.user.profile().submissions()
    });

    this.swapView(view);
  },
  
  submissionShow: function (id) {
    var submission = WavPool.submissions.getOrFetch(id);
    
    var view = new WavPool.Views.SubmissionShow({
      model: submission
    });
    
    this.swapView(view);
  },
  
  submissionEdit: function (id) {
    if (!WavPool.user) {
      WavPool.alerter.flash({
        context: "warning",
        message: "You must be signed in to do that."
      });
      
      return;
    }
    
    var submission = WavPool.submissions.getOrFetch(id);

    var view = new WavPool.Views.SubmissionForm({
    	model: submission
    });

    this.swapView(view);
  },
  
  feedShow: function () {
    if (!WavPool.user) {
      WavPool.alerter.flash({
        context: "warning",
        message: "You must be signed in to do that."
      });
      
      return;
    }

    WavPool.feed.fetch();
    
    var view = new WavPool.Views.FeedShow({
      model: WavPool.feed
    });
    
    this.swapView(view);
  },
  
  surfShow: function () {
    WavPool.surf.fetch();
    
    var view = new WavPool.Views.FeedShow({
      model: WavPool.surf
    });
    
    this.swapView(view);
  }
});