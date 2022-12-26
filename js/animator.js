/**
 * An abstract class to handle animations.
 *
 * It manages two animations: 1) update the text instruction, and 2) animate the circle.
 * The Animator is started by a Controller, and through a callback function,
 * the Controller gets notified by the Animator when the animations are completed.
 */
class Animator {

    /**
     * @param {Number}  duration      Duration of the animation in seconds.
     * @param {Object}  instruction   HTML element to hold the label string.
     * @param {Object}  circle        HTML element to hold the circle.
     */
    constructor(duration, instruction, circle) {
      this._duration = duration;
      this._instruction = instruction;
      this._circle = circle;
      this._playback = undefined;
      this._interval = undefined;
      this._label = undefined;
      this._from = undefined;
      this._to = undefined;
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
      this.animateCircle(controller);
      this.animateInstruction();
    }

    /**
     * Stops the animation.
     */
     stop() {
      if (this._playback) {
        clearInterval(this._interval);
        this._playback.cancel();
      }
    }
  
    /**
     * Called when the animation finishes. 
     *
     * The Animator calls back to the Controller to notify that the animation finished.
     *
     * @param {Object} controller   Reference to the Controller.
     */
    complete(controller) {
      clearInterval(this._interval);
      controller.next();
    }
  
    /**
     * Updates the circle.
     *
     * Simply sets the width and height of the circle to a new value.
     *
     * @param {Number} value    Interpolated value between [duration, 0].
     */
    animateCircle(controller) {
      const keyframes = new KeyframeEffect(
        this._circle, 
        {
          width: [this._from, this._to],
          height: [this._from, this._to],
        }, {
          duration: this._duration * 1000,
          fill: 'both',
      });
      this._playback = new Animation(keyframes);
      this._playback.addEventListener('finish', () => this.complete(controller));
      this._playback.play();
    }

    /**
     * Updates the instruction holding the label and countdown number.
     *
     * Simply sets the HTML of the instruction to a concatenated value of label + countdown.
     *
     * @param {Number} value    Interpolated value between [duration, 0].
     */
     animateInstruction() {
      this._interval = setInterval(() => {
        let counter = Math.round((1 - this._playback.effect.getComputedTiming().progress) * this._duration);
        this.updateInstruction(counter);
      }, 1000);
      // set initial string because `setInterval` triggers first time only after 1sec
      this.updateInstruction(this._duration);
    }
  
    updateInstruction(duration) {
      this._instruction.innerHTML = this._label + ' ' + duration;
    }
}

class InAnimator extends Animator {
    constructor(duration, instruction, circle) {
      super(duration, instruction, circle);
      this._label = 'Breathe in for';
      this._from = '0vmin';
      this._to = '100vmin';
    }
}
  
class HoldAnimator extends Animator {
    constructor(duration, instruction, circle) {
      super(duration, instruction, circle);
      this._label = 'Hold breath for';
      this._from = '100vmin';
      this._to = '100vmin';
    }
}
  
class OutAnimator extends Animator {
    constructor(duration, instruction, circle) {
      super(duration, instruction, circle);
      this._label = 'Breathe out for';
      this._from = '100vmin';
      this._to = '0vmin';
    }
}