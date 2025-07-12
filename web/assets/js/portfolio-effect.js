/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('effect-canvas');
/**
 * @type {HTMLDivElement}
 */
const leftContent = document.getElementById('content-left');
canvas.width = leftContent.clientWidth;
canvas.height = leftContent.clientHeight;

window.addEventListener('resize', () => {
  canvas.width = leftContent.clientWidth;
  canvas.height = leftContent.clientHeight;
});

const ctx = canvas.getContext('2d');
// draw points
ctx.fillStyle = 'white';

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

function radToDeg(rad) {
  return rad * (180 / Math.PI);
}

class Point {
  anchorX;
  anchorY;
  x;
  y;
  angle;
  offsetX;
  offsetY;
  radius;
  color = '#ffffffff';
  velocityX = 0; // pixels/sec
  velocityY = 0; // pixels/sec

  constructor(x, y, radius, angle, offsetX, offsetY) {
    this.anchorX = this.x = x;
    this.anchorY = this.y = y;
    this.radius = radius;
    this.angle = angle;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  update() {
    let frameDuration = 1 / 60; // seconds
    let displaceX = this.velocityX * frameDuration;
    let displaceY = this.velocityY * frameDuration;

    this.x += displaceX;
    this.y += displaceY;
  }
}

function randomOffset() {
  return (Math.random() - 0.5) * 50;
}

let points = [];

for (let j = 290; j >= 270; j -= 10) {
  let radius = j;
  for (let i = 0; i < 360; i += 1) {
    let x = radius * radToDeg(Math.cos(degToRad(i)));
    let y = radius * radToDeg(Math.sin(degToRad(i)));

    let point;
    points.push(
      (point = new Point(x, y, radius, i, randomOffset(), randomOffset()))
    );
    if (i % 2 == 0) {
      point.color = '#ffffffdd';
    }
  }
}

function anim() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let originX = canvas.width / 2;
  let originY = canvas.height / 2;
  for (const pt of points) {
    ctx.fillStyle = '#ffffffff';

    ctx.fillRect(
      originX + pt.anchorX + pt.offsetX,
      originY + pt.anchorY + pt.offsetY,
      2,
      2
    );

    pt.angle += 0.25;

    pt.anchorX = pt.radius * Math.cos(degToRad(pt.angle));
    pt.anchorY = pt.radius * Math.sin(degToRad(pt.angle));
    pt.update();
  }

  requestAnimationFrame(anim);
}

requestAnimationFrame(anim);
