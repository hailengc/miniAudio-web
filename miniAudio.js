var MiniAudio = (function() {
  function MA(containerId, options) {
    this.elemRoot = document.getElementById(containerId);
    this.elemPlayer = this.elemRoot.querySelector(".ma-player");
    this.elemAudio = this.elemRoot.querySelector(".ma-audio");
    this.elemAudio.loop = options && options.loop === true;
    this.init();
  }

  function _addClickListener(selector, listener) {
    this.elemRoot.querySelector(selector).addEventListener("click", listener);
    this.listenerMap = this.listenerMap || {};
    this.listenerMap[selector] = listener;
  }

  function _removeClickListener(selector) {
    this.elemRoot
      .querySelector(selector)
      .removeEventListener("click", this.listenerMap[selector]);
  }

  function _updateButtonImage() {
    let selector = ".button-play img";
    const playButtonImg = this.elemRoot.querySelector(selector);

    _removeClickListener.call(this, selector);
    if (!this.isPlaying) {
      playButtonImg.src = "assets/play.svg";
      playButtonImg.alt = "play";
      _addClickListener.call(this, selector, this.play.bind(this));
    } else {
      playButtonImg.src = "assets/pause.svg";
      playButtonImg.alt = "pause";
      _addClickListener.call(this, selector, this.pause.bind(this));
    }
  }

  MA.prototype.init = function() {
    _addClickListener.call(this, ".button-play img", this.play.bind(this));
    _addClickListener.call(this, ".button-stop img", this.stop.bind(this));
    _addClickListener.call(this, ".volume-up img", this.volumeUp.bind(this));
    _addClickListener.call(
      this,
      ".volume-down img",
      this.volumeDown.bind(this)
    );

    this.isPlaying = false;
  };

  MA.prototype.stop = function() {
    this.elemAudio.currentTime = 0;
    this.elemAudio.pause();
  };

  MA.prototype.play = function() {
    this.elemAudio.play();
    this.isPlaying = true;
    _updateButtonImage.call(this);
  };

  MA.prototype.pause = function() {
    this.elemAudio.pause();
    this.isPlaying = false;
    _updateButtonImage.call(this);
  };

  MA.prototype.volumeUp = function() {
    this.volumeChange(0.1);
  };

  MA.prototype.volumeDown = function() {
    this.volumeChange(-0.1);
  };

  MA.prototype.volumeChange = function(v) {
    var newVoulum = this.elemAudio.volume + v;
    if (newVoulum < 0 || newVoulum > 1) {
      return;
    }
    this.elemAudio.volume = newVoulum;
  };

  return MA;
})();
