var MiniAudio = (function() {
  function MA(containerId, options) {
    this.elemRoot = document.getElementById(containerId);
    this.elemPlayer = this.elemRoot.querySelector(".ma-player");
    this.elemAudio = this.elemRoot.querySelector(".ma-audio");
    this.bar = this.elemRoot.querySelector(".progress-bar .bar");
    this.brick = this.elemRoot.querySelector(".progress-bar .brick");
    this.elemAudio.loop = options && options.loop === true;
    window.ha = this.elemAudio;
    this.init();
  }

  function _getTimeFromProgressOffset(progressOffset) {
    const progressLength = this.bar.offsetWidth - this.brick.offsetWidth;
    return (progressOffset / progressLength) * this.elemAudio.duration * 0.999;
  }

  function _setBarEventHandler(param) {
    this.bar.addEventListener("click", event => {
      let brickOffset =
        event.clientX -
        this.bar.getBoundingClientRect().left -
        this.brick.offsetWidth / 2;
      brickOffset = Math.min(
        Math.max(0, brickOffset),
        this.bar.offsetWidth - this.brick.offsetWidth
      );
      this.elemAudio.currentTime = _getTimeFromProgressOffset.call(
        this,
        brickOffset
      );
    });
  }

  function _setBrickEventHandlers() {
    this.brick.addEventListener("mousedown", event => {
      this.pause();
      this.brickClick = true;
    });

    this.elemRoot.addEventListener("mouseup", event => {
      if (this.brickClick) {
        const brickOffset =
          this.brick.getBoundingClientRect().left -
          this.bar.getBoundingClientRect().left;
        const timeOffset = _getTimeFromProgressOffset.call(this, brickOffset);
        this.elemAudio.currentTime = timeOffset;
        this.play();
      }
      this.brickClick = false;
    });
    this.elemRoot.addEventListener("mousemove", event => {
      if (this.brickClick) {
        let brickOffset =
          event.clientX -
          this.bar.getBoundingClientRect().left -
          this.brick.offsetWidth / 2;
        brickOffset = Math.min(
          Math.max(0, brickOffset),
          this.bar.offsetWidth - this.brick.offsetWidth
        );

        this.updateProgressTimeText(
          _getTimeFromProgressOffset.call(this, brickOffset)
        );
        this.brick.style.left = Math.round(brickOffset) + "px";
      }
    });
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

  function _updatePlayButtonImage() {
    let selector = ".button-play img";
    const playButtonImg = this.elemRoot.querySelector(selector);

    _removeClickListener.call(this, selector);
    if (this.elemAudio.paused) {
      playButtonImg.src = "assets/play.svg";
      playButtonImg.alt = "play";
      _addClickListener.call(this, selector, this.play.bind(this));
    } else {
      playButtonImg.src = "assets/pause.svg";
      playButtonImg.alt = "pause";
      _addClickListener.call(this, selector, this.pause.bind(this));
    }
  }

  function _updateLoopButtonImage() {
    const loopButtonImg = this.elemRoot.querySelector(".button-loop img");
    if (this.elemAudio.loop) {
      loopButtonImg.src = "assets/loop-active.svg";
    } else {
      loopButtonImg.src = "assets/loop.svg";
    }
  }

  function _toCurrentTimeString(duration) {
    let minutes,
      seconds = 0;
    seconds = Math.floor(duration);
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let ms = [minutes, seconds].map(v => {
      let sv = v.toString();
      return sv.length > 1 ? sv : "0" + sv;
    });

    return ms.join(":");
  }

  function _updateProgressTime(progressTime) {
    const progressSpan = this.elemRoot.querySelector(".progress-panel span");
    progressSpan.textContent = progressTime;
  }

  MA.prototype.init = function() {
    _addClickListener.call(this, ".button-play img", this.play.bind(this));
    _addClickListener.call(this, ".button-stop img", this.stop.bind(this));
    _addClickListener.call(this, ".volume-up img", this.volumeUp.bind(this));
    _addClickListener.call(
      this,
      ".button-loop img",
      this.toggleLoop.bind(this)
    );
    _addClickListener.call(
      this,
      ".volume-down img",
      this.volumeDown.bind(this)
    );

    this.elemAudio.addEventListener("canplay", () => {}, false);

    this.elemAudio.addEventListener(
      "timeupdate",
      () => {
        this.updateProgressTimeText(this.elemAudio.currentTime);

        const offsetLeft =
          (this.elemAudio.currentTime / this.elemAudio.duration) *
          (this.bar.offsetWidth - this.brick.offsetWidth);
        this.brick.style.left = Math.round(offsetLeft) + "px";
      },
      false
    );

    this.elemAudio.addEventListener(
      "ended",
      () => {
        this.stop();
      },
      false
    );

    _setBrickEventHandlers.call(this);
    _setBarEventHandler.call(this);
  };

  MA.prototype.updateProgressTimeText = function(time) {
    _updateProgressTime.call(this, _toCurrentTimeString(time));
  };

  MA.prototype.toggleLoop = function() {
    this.elemAudio.loop = !this.elemAudio.loop;
    _updateLoopButtonImage.call(this);
  };

  MA.prototype.stop = function() {
    this.pause();
    this.elemAudio.currentTime = 0;
  };

  MA.prototype.play = function() {
    this.elemAudio.play();
    _updatePlayButtonImage.call(this);
  };

  MA.prototype.pause = function() {
    this.elemAudio.pause();
    _updatePlayButtonImage.call(this);
  };

  MA.prototype.volumeUp = function() {
    this.volumeChange(0.1);
  };

  MA.prototype.volumeDown = function() {
    this.volumeChange(-0.1);
  };

  MA.prototype.volumeChange = function(v) {
    const newVoulum = this.elemAudio.volume + v;
    if (newVoulum < 0 || newVoulum > 1) {
      return;
    }
    this.elemAudio.volume = newVoulum;
  };

  return MA;
})();
