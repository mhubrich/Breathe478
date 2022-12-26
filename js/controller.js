/**
 * A Controller to manage the sequence and flow of animations (breathe in, hold, breathe out).
 *
 * Based on the value of `repeat`, the `Controller` calls the `start` function of the `Animator`
 * objects exactly `repeat` * `animators.length` times. The `Controller` cycles through the
 * `Animator`'s `repeat` times, i.e. the ordering of passed `Animator`s is important.
 * Note that the `Controller` does not have any knowledge of the implementation details of
 * the `Animator` but solely controls the flow, i.e. it starts an `Animator` and after
 * completion starts the next one.
 */
 class Controller {

    /**
     * @param {Array}   animators   Array of `Animator` objects.
     * @param {Number}  repeat      Number of times to cycle through all `animators`.
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
     * The iterator pops the last item in the stack of `Animator`s and calls their start function.
     */
    next() {
      this._currentAnimator = this._animators.pop();
      if (this._currentAnimator) {
        this._currentAnimator.start(this);
      } else {
        this.complete();
      }
    }
  
    /**
     * Called one time before the first animation starts.
     * 
     * Toggles the UI to display the animation view.
     */
    setup() {
      document.getElementById('landing').style.display = 'none';
      document.getElementById('animation').style.display = 'flex';
    }
  
    /**
     * Called one time after the last animation completes or if an animation stops.
     * 
     * Toggles the UI to display the landing page view.
     */
    cleanup() {
      document.getElementById('animation').style.display = 'none';
      document.getElementById('landing').style.display = 'flex';
    }
  
    /**
     * Starts the sequence of animations.
     */
    start() {
      this.setup();
      this.next();
    }
  
    /**
     * Stops playback and therefore any animation.
     */
    stop() {
      if (this._currentAnimator) {
        this._currentAnimator.stop();
      }
      this.cleanup();
    }

    /**
     * Called after all animations complete successfully.
     */
    complete() {
      this.cleanup();
    }
}