/**
 * Starts the 4-7-8 breathing technique.
 *
 * The function creates all necessary Animators and Controller, adds a click listener to
 * the stop button, and eventually calls the `start` method of the Controller.
 *
 * @param {Number} breatheIn     Duration of the 'breathe in' animation in seconds.
 * @param {Number} hold          Duration of the 'hold' animation in seconds.
 * @param {Number} breatheOut    Duration of the 'breathe out' animation in seconds.
 * @param {Number} repeat        Number of times to cycle through all animations.
 */
function start(breatheIn=4, hold=7, breatheOut=8, repeat=3) {
    const instruction = document.getElementById('instruction');
    const circle = document.getElementById('circle');
    const inAnimator = new InAnimator(breatheIn, instruction, circle);
    const holdAnimator = new HoldAnimator(hold, instruction, circle);
    const outAnimator = new OutAnimator(breatheOut, instruction, circle);
    const controller = new Controller([inAnimator, holdAnimator, outAnimator], repeat);
    const btn_stop = document.getElementById('stop');
    btn_stop.addEventListener('click', () => controller.stop());
    controller.start();
}

const btn_start = document.getElementById('start');
btn_start.addEventListener('click', () => start());