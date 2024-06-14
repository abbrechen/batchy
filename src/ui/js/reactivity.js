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