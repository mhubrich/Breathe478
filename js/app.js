const { animate, linear } = popmotion;

/**
 * A Controller to manage the sequence and flow of animations (breathe in, hold, breathe out).
 *
 * Based on the value of `repeat`, the Controller calls the `start` function of the Animator
 * objects exactly `repeat` * `animators.length` times. The Controller cycles through the
 * Animators `repeat` times, i.e. the ordering of passed Animators is important.
 */
class Controller {

    /**
     * @param {Array}   animators   Array of Animator objects.
     * @param {Number}  repeat      Number of times to cycle through all Animators.
     */
    constructor(animators, repeat=3) {
      // Repeats the `animators` array exactly `repeat` times
      this._animators = Array(repeat).fill(animators).flat().reverse();
      this._repeat = repeat;
      this._currentAnimator = undefined;
    }
  
    /**
     * Iterator to cycle through the animations.
     *
     * The iterator pops the last item in the stack of Animators and calls their start function.
     */
    next() {
      this._currentAnimator = this._animators.pop();
      if (this._currentAnimator) {
        this._currentAnimator.start(this);
      }
    }
  
    /**
     * Called one time before the first animation starts.
     */
    setup() {}
  
    /**
     * Called one time after the last animation completes.
     */
    cleanup() {}
  
    /**
     * Starts the sequence of animations.
     */
    start() {
      this.setup();
  
      this.next();
  
      this.cleanup();
    }
  
    /**
     * Stops playback and therefore any animation.
     */
    stop() {
      if (this._currentAnimator) {
        this._currentAnimator.stop();
      }
    }
  
}

/**
 * An abstract class to handle animations.
 *
 * It manages two animations: 1) update the text countdown, and 2) animate the circle.
 * The Animator is started by a Controller, and through a callback function,
 * the Controller gets notified by the Animator when the animations are completed.
 */
class Animator {

    /**
     * @param {String}  label       The label to use for the corresponding phase (e.g. breathe in).
     * @param {Number}  duration    Duration of the animation.
     * @param {Object}  title       HTML element to hold the label string.
     * @param {Object}  circle      HTML element to hold the circle.
     */
    constructor(label, duration, title, circle) {
      this._label = label;
      this._duration = duration;
      this._title = title;
      this._circle = circle;
      this._playback = undefined;
    }
  
    /**
     * Starts playback of the two animations.
     *
     * Uses the popmotion library to create linear keyframes between [duration, 0] and sends the
     * interpolated values to the onUpdate function for rendering.
     *
     * @fires   onUpdate
     * @fires   onComplete
     *
     * @param {Object} controller   Reference to the Controller.
     */
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
  
    /**
     * Called when the animation finishes. 
     *
     * The Animator calls back to the Controller to notify that the animation finished.
     *
     * @param {Object} controller   Reference to the Controller.
     */
    complete(controller) {
      controller.next();
    }
  
    /**
     * Stops the animation.
     */
    stop() {
      if (this._playback) {
        this._playback.stop();
      }
    }
  
    /**
     * Called at every update step to refresh the animation.
     *
     * Will call functions to update title and circle seperately.
     *
     * @param {Number} value    Interpolated value between [duration, 0].
     */
    update(value) {
      this.updateTitle(value);
      this.updateCircle(value);
    }
  
    /**
     * Updates the title holding the label and countdown number.
     *
     * Simply sets the HTML of the title to a concatenated value of label + countdown.
     *
     * @param {Number} value    Interpolated value between [duration, 0].
     */
    updateTitle(value) {
      this._title.innerHTML = this._label + Math.ceil(value);
    }
  
    /**
     * Updates the circle.
     *
     * Simply sets the width and height of the circle to a new value.
     *
     * @param {Number} value    Interpolated value between [duration, 0].
     */
    updateCircle(value) {
      const percent = this.toPercent(value);
      this._circle.style.width = percent;
      this._circle.style.height = percent;
    }
  
    /**
     * Converts the interpolated value to a percentage value.
     *
     * @abstract
     *
     * @param {Number} value    Interpolated value between [duration, 0].
     * 
     * @return {String}         Percentage value including the percentage sign (%).
     */
    toPercent(value) {}
}

  class InAnimator extends Animator {
    constructor(label, duration, title, circle) {
      super(label, duration, title, circle); 
    }
  
    /**
     * Converts the interpolated value to a percentage value.
     *
     * The returned percentage value is reverse, i.e. "100%-percent".
     *
     * @param {Number} value    Interpolated value between [duration, 0].
     * 
     * @return {String}         Percentage value including the percentage sign (%).
     */
    toPercent(value) {
      return Math.round(100 * (1 - (value / this._duration))) + '%';
    }
  }
  
  class HoldAnimator extends Animator {
    constructor(label, duration, title, circle) {
      super(label, duration, title, circle); 
    }
  
    /**
     * Converts the interpolated value to a percentage value.
     *
     * For the hold animation, we return a constant string of "100%".
     *
     * @param {Number} value    Interpolated value between [duration, 0].
     * 
     * @return {String}         Always returns the string "100%".
     */
    toPercent(value) {
      return '100%';
    }
  }
  
  class OutAnimator extends Animator {
    constructor(label, duration, title, circle) {
      super(label, duration, title, circle); 
    }
  
    /**
     * Converts the interpolated value to a percentage value.
     *
     * @param {Number} value    Interpolated value between [duration, 0].
     * 
     * @return {String}         Percentage value including the percentage sign (%).
     */
    toPercent(value) {
      return Math.round(100 * (value / this._duration)) + '%';
    }
  }