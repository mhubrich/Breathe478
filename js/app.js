const { animate, linear } = popmotion;

/**
 * An abstract class to handle animations.
 *
 * It controlls two animations: 1) update the text countdown, and 2) animate the circle.
 *
 * @param {String}  label   The label to use for the corresponding phase (e.g. breathe in).
 * @param {Number}  max     Duration of the animation.
 * @param {Object}  title   HTML element to hold the label string.
 * @param {Object}  circle  HTML element to hold the circle.
 */
class Animator {

    constructor(label, max, title, circle) {
      this._label = label;
      this._max = max;
      this._title = title;
      this._circle = circle;
      this._playback = undefined;
    }
  
    start(controller) {
      this._playback = animate({
        from: this._max,
        to: 0,
        duration: this._max * 1000,
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
    constructor(label, max, title, circle) {
      super(label, max, title, circle); 
    }
  
    toPercent(value) {
      return Math.round(100 * (1 - (value / this._max))) + '%';
    }
  }
  
  class HoldAnimator extends Animator {
    constructor(label, max, title, circle) {
      super(label, max, title, circle); 
    }
  
    toPercent(value) {
      return '100%';
    }
  }
  
  class OutAnimator extends Animator {
    constructor(label, max, title, circle) {
      super(label, max, title, circle); 
    }
  
    toPercent(value) {
      return Math.round(100 * (value / this._max)) + '%';
    }
  }