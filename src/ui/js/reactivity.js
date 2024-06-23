// ====== REACTIVITY FUNCTIONS ======
// Might be that some reactivity functions are living in window.onmessage();

import * as ui from './_helpers/ui-elements';

// enable / disable scaling option if not supported by the selected file format
const showScaling = (e) => {
  if (e === 'png' || e === 'jpg') {
    ui.scalingObj.style.opacity = 1;
    ui.scalingObj.removeAttribute('disabled', '');
  } else {
    ui.scalingObj.style.opacity = 0;
    ui.scalingObj.setAttribute('disabled', '');
  }
}
window.showScaling = showScaling;

// set blinking cursor position, based on text length

const setCursorPosition = (value) => {
  if(value) {
    ui.cursor.style.left = value + 20;
  } else {
    ui.cursor.style.left = 0;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const textLengthHelper = document.getElementById('text-length-helper');
  setCursorPosition();

  ui.input.addEventListener('keydown', () => {
    textLengthHelper.textContent = ui.input.value;
    var textWidth = textLengthHelper.clientWidth;
    setCursorPosition(textWidth);
  });
});

export {
  setCursorPosition
}
