const { animate, linear } = popmotion;

/**
 * An abstract class to handle animations.
 *
 * It controlls two animations: 1) update the text countdown, and 2) animate the circle.
 *
 * @param {String}  label       The label to use for the corresponding phase (e.g. breathe in).
 * @param {Number}  duration    Duration of the animation.
 * @param {Object}  title       HTML element to hold the label string.
 * @param {Object}  circle      HTML element to hold the circle.
 */
class Animator {

    constructor(label, duration, title, circle) {
      this._label = label;
      this._duration = duration;
      this._title = title;
      this._circle = circle;
      this._playback = undefined;
    }
  
    start(controller) {
      this._playback = animate({
        from: this._duration,
        to: 0,
        duration: this._duration * 1000,
        type: 'keyframes',
        ease: linear,
        onUpdate: latest => this.update(latest),
        onComplete: () => this.complete(controller)
      });
    }
  
    complete(controller) {
      controller.next();
    }
  
    stop() {
      if (this._playback) {
        this._playback.stop();
      }
    }
  
    update(value) {
      this.updateTitle(value);
      this.updateCircle(value);
    }
  
    updateTitle(value) {
      this._title.innerHTML = this._label + Math.ceil(value);
    }
  
    updateCircle(value) {
      const percent = this.toPercent(value);
      this._circle.style.width = percent;
      this._circle.style.height = percent;
    }
  
    toPercent(value) {}
  }

  class InAnimator extends Animator {
    constructor(label, duration, title, circle) {
      super(label, duration, title, circle); 
    }
  
    toPercent(value) {
      return Math.round(100 * (1 - (value / this._duration))) + '%';
    }
  }
  
  class HoldAnimator extends Animator {
    constructor(label, duration, title, circle) {
      super(label, duration, title, circle); 
    }
  
    toPercent(value) {
      return '100%';
    }
  }
  
  class OutAnimator extends Animator {
    constructor(label, duration, title, circle) {
      super(label, duration, title, circle); 
    }
  
    toPercent(value) {
      return Math.round(100 * (value / this._duration)) + '%';
    }
  }