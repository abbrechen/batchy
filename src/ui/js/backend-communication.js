// ======
// Receiving messages from the backend will be handled here
// ======

import * as ui from './_helpers/ui-elements';

// General message receiver
window.onmessage = (msg) => {
  const m = msg.data.pluginMessage;
  // get the bundled information, including image data + config information
  if (m.type === '02-export-bundle') {
    const exportBundle = m.exportBundle;
    // depending on if the user has selected one or multiple images, start a function that downloads a single image or a zip file
    exportBundle.length > 1 ? downloadZip(exportBundle) : downloadSingleFile(exportBundle[0]);
    // react if there is no selection
  } else if (m.type === 'selection-empty') {
    const isSelectionEmpty = m.isSelectionEmpty;
    if (isSelectionEmpty) {
      // ui.downloadButton.style.opacity = 0.5;
      ui.downloadButton.setAttribute('disabled', '');
    } else {
      // ui.downloadButton.style.opacity = 1;
      ui.downloadButton.removeAttribute('disabled', '');
    }
  }
}
