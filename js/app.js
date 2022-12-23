// References to UI elements
const btn_start = document.getElementById('start');
const btn_stop = document.getElementById('stop');
const title = document.getElementById('title');
const circle = document.getElementById('circle');


/**
* Changes visibility of UI elements to show the landing page view.
 */
function landingUI() {
    btn_start.style.visibility = 'visible';
    btn_stop.style.visibility = 'hidden';
    title.style.visibility = 'hidden';
    circle.style.visibility = 'hidden';
}

/**
* Changes visibility of UI elements to show the animation view.
 */
function animationUI() {
    btn_start.style.visibility = 'hidden';
    btn_stop.style.visibility = 'visible';
    title.style.visibility = 'visible';
    circle.style.visibility = 'visible';
}

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
    const inAnimator = new InAnimator('Breathe in for ', breatheIn, title, circle);
    const holdAnimator = new HoldAnimator('Hold breath for ', hold, title, circle);
    const outAnimator = new OutAnimator('Breathe out for ', breatheOut, title, circle);
    const controller = new Controller([inAnimator, holdAnimator, outAnimator], repeat);
    btn_stop.addEventListener('click', () => {controller.stop(); landingUI()});
    controller.start();
}

btn_start.addEventListener('click', () => {animationUI(); start()});
landingUI();