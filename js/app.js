// Test the Controller and Animators
const title = document.getElementById('title');
const circle = document.getElementById('circle');
const inAnimator = new InAnimator('Breathe in for ', 4, title, circle);
const holdAnimator = new HoldAnimator('Hold breath for ', 7, title, circle);
const outAnimator = new OutAnimator('Breathe out for ', 8, title, circle);
const controller = new Controller([inAnimator, holdAnimator, outAnimator], 3);
controller.start();