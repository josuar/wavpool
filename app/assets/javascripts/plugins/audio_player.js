$.fn.audioPlayer = function () {
  if (this.length > 1) {
    return this.each(function() {
      $(this).audioPlayer()
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

  remoteOptions = null;

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

  this.bindRemote = function (options) {
    resetRemote();
    
    remoteOptions = options;

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

  this.initialize = function () {
    $audio.on("play", onAudioPlayPause);
    $audio.on("pause", onAudioPlayPause);

    $audio.on("timeupdate", onTimeUpdate);

    $playToggle.on("click", onPlayToggle);

    return this;
  };

  return this.initialize();
};