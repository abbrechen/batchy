// ======
// Receiving messages from the backend will be handled here
// ======

import * as ui from './_helpers/ui-elements';
import Store from './store';

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
      ui.downloadButton.removeAttribute('class', 'download-button');
      ui.downloadButton.setAttribute('disabled', '');
      ui.downloadButton.innerHTML = 'Select layers to download them';
    } else {
      // ui.downloadButton.style.opacity = 1;
      ui.downloadButton.removeAttribute('disabled', '');
      ui.downloadButton.setAttribute('class', 'download-button');
      ui.downloadButton.innerHTML = 'Download';
    }
  } else if (m.type === 'user') {
    ui.username.innerHTML = m.user;
  } else if (m.type === 'receive-preview') {
    const listEl = ui.selectionList;
    while (listEl.firstChild) {
      listEl.removeChild(listEl.lastChild);
    }
    console.log(m.list)
    Store.replaceSelectionList((m.list));
    let elements = Store.getSelectionList();
    elements.forEach((el) => {
      var li = document.createElement('li');
      li.setAttribute('onclick', 'deleteSelf(this)');
      li.setAttribute('id', el.id);
      li.innerHTML = el.name;
      listEl.appendChild(li);
    });
  }
}
