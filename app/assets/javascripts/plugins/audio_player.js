$.fn.audioPlayer = function () {
  if (this.length > 1) {
    return this.each(function() {
      $(this).audioPlayer();
    });
  }

  var $audio = this.find('audio');
  var audio = $audio.get(0);

  var $playToggle = this.find('.play-toggle');
  var $playButton = $playToggle.find('span');

  var $prevTrack = this.find('.prev-track');
  var $nextTrack = this.find('.next-track');

  var $trackTitle = this.find('.track-title');

  var $progressBar = this.find('.progress');

  var currentTrack = null;
  var queue = [];

  var remoteOptions = null;
  
  var currentComment = null;
  
  var resetRemote = function () {
    if (!remoteOptions) {
      return;
    }
      
    remoteOptions.$playButton
      .find('span')
      .removeClass("glyphicon-pause")
      .addClass("glyphicon-play");
      
    remoteOptions.reset();
  };

  var setPlayButton = function ($el) {
    if (audio.paused) {
      $el.removeClass("glyphicon-pause");
      $el.addClass("glyphicon-play");
    } else {
      $el.removeClass("glyphicon-play");
      $el.addClass("glyphicon-pause");
    }
  };

  var onAudioPlayPause = function (event) {
    setPlayButton($playButton);

    if (remoteOptions) {
      setPlayButton(remoteOptions.$playButton.find('span'));
    }
  };

  var onPlayToggle = function (event) {
    event.preventDefault();

    if (audio.paused) {
      play();
    } else {
      pause();
    }
  };

  var updateProgressBar = function ($bar) {
    var maxWidth = $bar.width();
    var newWidth = Math.floor((audio.currentTime / audio.duration) * maxWidth);

    $bar.children('.progress-bar').css("width", newWidth);
  };

  var onTimeUpdate = function (event) {
    updateProgressBar($progressBar);

    if (remoteOptions) {
      updateProgressBar(remoteOptions.$progressBar);
      processComments();
    }
  };
  
  var processComments = function () {
    if (!remoteOptions.comments || currentComment) {
      return;
    }
    
    var comment = remoteOptions.comments[Math.floor(audio.currentTime)];
    
    if (comment) {
      currentComment = comment[0];
      currentComment.line.addClass("active");
      
      var $commentBubble = $('<div>').
        addClass("progress-comment").
        text(currentComment.comment.get("content"));
        
      var offset = remoteOptions.$progressBar.children('.progress-bar').width();
      
      remoteOptions.$progressBar.prepend($commentBubble);
        
      if (currentComment.comment.get("position") < 50) {
        $commentBubble.css("left", offset);
      } else {
        $commentBubble.css("left", offset - $commentBubble.width() - 20);
      }
      
      _.delay(function () {
        currentComment.line.removeClass("active");
        currentComment = null;
        
        $commentBubble.remove();
      }, 3000);
    }
  };

  var play = function () {
    if (!currentTrack) {
      return;
    }

    audio.play();
  };

  var pause = function () {
    if (!currentTrack) {
      return;
    }

    audio.pause();
  };

  var render = function () {
    $trackTitle.text(currentTrack.title);
  };

  var processQueue = function () {
    currentTrack = queue.shift();

    if (!currentTrack) {
      return;
    }

    $audio.attr("src", currentTrack.url);
    render();

    audio.load();
    play();
  };
  
  var onProgressClick = function (event) {    
    this.seek(event.offsetX, $progressBar.width());
  }.bind(this);
  
  this.seek = function (x, seekWidth) {
    if (!currentTrack) {
      return;
    }
    
    audio.currentTime = Math.floor(x * (audio.duration / seekWidth));
  };

  this.bindRemote = function (options) {
    resetRemote();
    remoteOptions = options;
    
    $audio.one("loadeddata", function () {
      var x = remoteOptions.$progressBar.find('.progress-bar').width();     
      this.seek(x, remoteOptions.$progressBar.width());
    }.bind(this));

    updateProgressBar(remoteOptions.$progressBar);
    setPlayButton(remoteOptions.$playButton.find('span'));
  };

  this.enqueueTrack = function (track) {
    queue.push(track);
  };

  this.playTrack = function (track) {
    queue.unshift(track);
    processQueue();
  };

  this.togglePlayState = function () {
    if (audio.paused) {
      play();
    } else {
      pause();
    }
  };

  this.submissionId = function () {
    if (currentTrack) {
      return currentTrack.id;
    }
    
    return 0;
  };
  
  this.duration = function () {
    if (!currentTrack) {
      return 0;
    }
    
    return audio.duration;
  }
  
  this.timestamp = function () {
    if (!currentTrack) {
      return 0;
    }
    
    return Math.floor(audio.currentTime);
  }

  this.initialize = function () {
    $audio.on("play", onAudioPlayPause);
    $audio.on("pause", onAudioPlayPause);

    $audio.on("timeupdate", onTimeUpdate);

    $playToggle.on("click", onPlayToggle);
    $progressBar.on("click", onProgressClick);

    return this;
  };

  return this.initialize();
};