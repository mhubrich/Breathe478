/**
 * An abstract class to handle animations.
 *
 * It manages two animations: 1) update the text instruction, and 2) animate the circle.
 * The `Animator` is started by a `Controller`, and through a callback function,
 * the `Controller` gets notified by the `Animator` when the animations are completed.
 */
class Animator {

    /**
     * @param {String}  label         The text instruction (e.g. 'breate in').
     * @param {Number}  from          Starting size of the circle animation.
     * @param {Number}  to            Ending size of the circle animation.
     * @param {Number}  duration      Duration of the animation in seconds.
     * @param {Object}  instruction   HTML element to hold the instruction.
     * @param {Object}  circle        HTML element to hold the circle.
     */
    constructor(label, from, to, duration, instruction, circle) {
      if (new.target === Animator) {
        throw new TypeError('Cannot construct instance of abstract class ' + new.target.name);
      }
      this._label = label;
      this._from = from;
      this._to = to;
      this._duration = duration;
      this._instruction = instruction;
      this._circle = circle;
      this._playback = undefined;
      this._interval = undefined;
    }
  
    /**
     * Starts playback of the two animations.
     *
     * Simply calls start of the two animations (instruction and circle) separately.
     *
     * @param {Object} controller   Reference to the `Controller`.
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
     * The `Animator` calls back to the `Controller` to notify that the animation finished.
     *
     * @param {Object} controller   Reference to the Controller.
     */
    complete(controller) {
      clearInterval(this._interval);
      controller.next();
    }
  
    /**
     * Animates the circle.
     *
     * Uses the native Web Animation API to change width and height of the circle.
     * 
     * @fires   complete
     *
     * @param {Object} controller   Reference to the `Controller`.
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
     * Animates the instruction.
     *
     * Updates the countdown of the instruction evert 1 second.
     */
     animateInstruction() {
      this._interval = setInterval(() => {
        let counter = Math.round((1 - this._playback.effect.getComputedTiming().progress) * this._duration);
        this.updateInstruction(counter);
      }, 1000);
      // set initial string because `setInterval` triggers first time only after 1sec
      this.updateInstruction(this._duration);
    }
    
    /**
     * Updates the instruction.
     * 
     * Sets the HTML of the instruction to a concatenated string of label + `counter`.
     * 
     * * @param {Number} counter  Numeric countdown value.
     */
    updateInstruction(counter) {
      this._instruction.innerHTML = this._label + ' ' + counter;
    }
}

class InAnimator extends Animator {
    constructor(duration, instruction, circle) {
      super('Breathe in for', '0vmin', '80vmin', duration, instruction, circle);
    }
}
  
class HoldAnimator extends Animator {
    constructor(duration, instruction, circle) {
      super('Hold breath for', '80vmin', '80vmin', duration, instruction, circle);
    }
}
  
class OutAnimator extends Animator {
    constructor(duration, instruction, circle) {
      super('Breathe out for', '80vmin', '0vmin', duration, instruction, circle);
    }
}