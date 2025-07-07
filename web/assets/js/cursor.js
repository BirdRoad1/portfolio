/**
 * @type {HTMLDivElement}
 */
const fakeCursor = document.getElementById("fake-cursor");

/**
 * @type {number | undefined}
 */
let lastX = undefined;
/**
 * @type {number | undefined}
 */
let lastY = undefined;
/**
 * @type {number | undefined}
 */
let mouseX = undefined;
/**
 * @type {number | undefined}
 */
let mouseY = undefined;

let cursorDiameter = fakeCursor.clientWidth;
let cursorOffset = -cursorDiameter / 2;

/**
 * @param {number} cursorX 
 * @param {number} cursorY 
 */
function checkBtnsHover(cursorX, cursorY) {
  let hovering = false;
  for (const elem of document.querySelectorAll(".hoverable")) {
    const rect = elem.getBoundingClientRect();
    if (
      cursorX - cursorOffset >= rect.x &&
      cursorX - cursorOffset <= rect.x + rect.width &&
      cursorY - cursorOffset >= rect.y &&
      cursorY - cursorOffset <= rect.y + rect.height
    ) {
      fakeCursor.classList.add("hover");
      elem.classList.add("hover");
      hovering = true;
    } else {
      elem.classList.remove("hover");
    }
  }

  if (!hovering) {
    fakeCursor.classList.remove("hover");
  }
}

document.addEventListener("click", () => {
  for (const elem of document.querySelectorAll("button")) {
    const rect = elem.getBoundingClientRect();
    if (
      mouseX - cursorOffset >= rect.x &&
      mouseX - cursorOffset <= rect.x + rect.width &&
      mouseY - cursorOffset >= rect.y &&
      mouseY - cursorOffset <= rect.y + rect.height
    ) {
      elem.dispatchEvent(new Event("cursorClick"));
    }
  }
});

document.addEventListener("mousemove", (ev) => {
  mouseX = ev.pageX;
  mouseY = ev.pageY;
});

window.addEventListener('pageshow', () => {
  mouseX = lastX = mouseY = lastY = undefined;
});

let frameDuration = 10;

function anim() {
  if (mouseX === undefined || mouseY === undefined) {
    requestAnimationFrame(anim);
    return;
  }

  if (lastX === undefined || lastY === undefined) {
    lastX = mouseX;
    lastY = mouseY;

    requestAnimationFrame(anim);
    return;
  }

  let diameter = fakeCursor.clientWidth;
  let offset = -diameter / 2;

  let interpX = lastX + (mouseX + offset - lastX) / frameDuration;
  let interpY = lastY + (mouseY + offset - lastY) / frameDuration;
  lastX = interpX;
  lastY = interpY;

  fakeCursor.style.left = interpX + "px";
  fakeCursor.style.top = interpY + "px";

  checkBtnsHover(interpX, interpY);

  requestAnimationFrame(anim);
}

requestAnimationFrame(anim);
