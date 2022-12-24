/**
 * Starts the 4-7-8 breathing technique.
 *
 * The function creates all necessary Animators and Controller, adds a click listener to
 * the stop button, and eventually calls the `start` method of the Controller.
 *
 * @param {Number} breatheIn     Duration of the 'breathe in' animation.
 * @param {Number} hold          duration of the 'hold' animation.
 * @param {Number} breatheOut    Duration of the 'breathe out' animation.
 * @param {Number} repeat        Number of times to cycle through all animations.
 */
function start(breatheIn=4, hold=7, breatheOut=8, repeat=3) {
    const circle = document.getElementById('circle');
    const inAnimator = new InAnimator('Breathe in for ', breatheIn, circle);
    const holdAnimator = new HoldAnimator('Hold breath for ', hold, circle);
    const outAnimator = new OutAnimator('Breathe out for ', breatheOut, circle);
    const controller = new Controller([inAnimator, holdAnimator, outAnimator], repeat);
    const btn_stop = document.getElementById('stop');
    btn_stop.addEventListener('click', () => controller.stop());
    controller.start();
}

const btn_start = document.getElementById('start');
btn_start.addEventListener('click', () => start());