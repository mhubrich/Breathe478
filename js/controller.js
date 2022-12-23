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