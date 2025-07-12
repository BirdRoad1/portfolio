/**
 * A self-contained and smooth cursor replacement
 */

const lerpFactor = 0.1;
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
let mouseXPercent;
/**
 * @type {number | undefined}
 */
let mouseYPercent;

let enabled = (localStorage.getItem('cursor-enabled') ?? 'true') === 'true';

// Reset cursor when hitting the back button
window.addEventListener('pageshow', () => {
  mouseXPercent = mouseYPercent = lastX = lastY = undefined;
});

// Inject style tag into <head>
async function injectCSS() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/assets/css/cursor.css';
  document.head.appendChild(link);

  return new Promise((resolve, reject) => {
    let func = success => {
      link.removeEventListener('load', func);
      if (success) {
        resolve();
      } else {
        reject();
      }
    };

    link.addEventListener('load', () => func(true));
    link.addEventListener('error', () => func(false));
  });
}

// Create cursor toggle menu
function createCursorMenu() {
  const div = document.createElement('div');
  div.classList.add('cursor-toggle-section');
  const txt = document.createElement('a');
  txt.classList.add('cursor-toggle-text');
  txt.href = '/assets/js/cursor.js';
  txt.target = '_blank';
  txt.textContent = 'Fancy Cursor';
  div.appendChild(txt);
  const btn = document.createElement('button');
  btn.classList.add('cursor-toggle-btn', 'hoverable');
  btn.id = 'cursor-toggle-btn';
  div.appendChild(btn);
  document.body.prepend(div);

  return btn;
}

// Get absolute cursor pixel coordinates
function getMousePos() {
  let mouseX = mouseXPercent * document.body.clientWidth;
  let mouseY = mouseYPercent * document.body.clientHeight;
  return { mouseX, mouseY };
}

/**
 * Adds hover class to cursor when hovering over hoverable element
 * @param {number} cursorX
 * @param {number} cursorY
 */
function checkBtnsHover(cursor, cursorX, cursorY) {
  let hovering = false;
  for (const elem of document.querySelectorAll('.hoverable')) {
    const rect = elem.getBoundingClientRect();
    if (
      cursorX >= rect.x &&
      cursorX <= rect.x + rect.width &&
      cursorY >= rect.y &&
      cursorY <= rect.y + rect.height
    ) {
      cursor.classList.add('hover');
      elem.classList.add('hover');
      hovering = true;
    } else {
      elem.classList.remove('hover');
    }
  }

  if (!hovering) {
    cursor.classList.remove('hover');
  }
}

/**
 * Adds caret class to cursor when hovering over text element
 * @param {number} cursorX
 * @param {number} cursorY
 */
function checkTextHover(cursor, cursorX, cursorY) {
  if (!enabled) return;
  let hovering = false;
  for (const elem of document.querySelectorAll('.text')) {
    const rect = elem.getBoundingClientRect();
    if (
      cursorX >= rect.x &&
      cursorX <= rect.x + rect.width &&
      cursorY >= rect.y &&
      cursorY <= rect.y + rect.height
    ) {
      cursor.classList.add('caret');
      hovering = true;
      break;
    }
  }

  if (!hovering) {
    cursor.classList.remove('caret');
  }
}

/**
 * Update cursor position every frame
 * @param {Function} self A function to call for the next frame
 * @param {HTMLDivElement} cursor A div representing the cursor
 * @returns
 */
function anim(self, cursor) {
  if (!enabled || mouseXPercent === undefined || mouseYPercent === undefined) {
    cursor.classList.remove('visible');
    document.body.classList.remove('cursor-visible');

    if (enabled) {
      requestAnimationFrame(self);
    }

    return;
  }

  document.body.classList.add('cursor-visible');
  cursor.classList.add('visible');

  let { mouseX, mouseY } = getMousePos();

  lastX ??= mouseX;
  lastY ??= mouseY;

  let lerpX = lastX + (mouseX - lastX) * lerpFactor;
  let lerpY = lastY + (mouseY - lastY) * lerpFactor;

  lastX = lerpX;
  lastY = lerpY;

  cursor.style.left = lerpX + 'px';
  cursor.style.top = lerpY + 'px';

  checkBtnsHover(cursor, lerpX, lerpY);
  checkTextHover(cursor, lerpX, lerpY);

  requestAnimationFrame(self);
}

/**
 * Update cursor classes based on the cursor's state
 * @param {HTMLDivElement} cursor
 * @param {HTMLButtonElement} cursorToggle
 */
function updateCursorState(cursor, cursorToggle) {
  cursorToggle.textContent = enabled ? 'On' : 'Off';
  if (enabled) {
    localStorage.setItem('cursor-enabled', 'true');
    document.body.classList.add('cursor-enabled');
    const func = () => anim(func, cursor);
    requestAnimationFrame(func);
  } else {
    localStorage.setItem('cursor-enabled', 'false');
    document.body.classList.remove('cursor-enabled');
  }
}

function createCursor() {
  const fakeCursor = document.createElement('div');
  fakeCursor.id = 'fake-cursor';
  fakeCursor.classList.add('fake-cursor');
  document.body.appendChild(fakeCursor);

  return fakeCursor;
}

function init() {
  // Create cursor
  const cursor = createCursor();

  const cursorToggle = createCursorMenu();
  cursorToggle.addEventListener('click', () => {
    enabled = !enabled;
    updateCursorState(cursor, cursorToggle);
  });

  // Maintain cursor position on resize
  window.addEventListener('resize', () => {
    lastX = mouseXPercent * document.body.clientWidth;
    lastY = mouseYPercent * document.body.clientHeight;
  });

  // Update mouse position when moved
  document.addEventListener('mousemove', ev => {
    mouseXPercent = ev.pageX / document.body.clientWidth;
    mouseYPercent = ev.pageY / document.body.clientHeight;
  });

  updateCursorState(cursor, cursorToggle);
}

injectCSS().then(init);
