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
    const isSelectionListEmpty = m.isSelectionListEmpty;
    if (isSelectionEmpty && isSelectionListEmpty) {
      // ui.downloadButton.style.opacity = 0.5;
      ui.downloadButton.removeAttribute('class', 'download-button');
      ui.downloadButton.setAttribute('disabled', '');
      ui.downloadButton.innerHTML = 'Select layers to download them or add them to the list';
    } else if(!isSelectionEmpty) {
      // ui.downloadButton.style.opacity = 1;
      ui.downloadButton.removeAttribute('disabled', '');
      ui.downloadButton.setAttribute('class', 'download-button');
      ui.downloadButton.innerHTML = 'Download LIVE selections';
    } else if(isSelectionEmpty && !isSelectionListEmpty) {
      ui.downloadButton.removeAttribute('disabled', '');
      ui.downloadButton.setAttribute('class', 'download-button');
      ui.downloadButton.innerHTML = 'Download LIST selections';
    }
  } else if (m.type === 'user') {
    ui.username.innerHTML = m.user;
  } else if (m.type === 'receive-preview') {
    const listEl = ui.selectionList;
    while (listEl.firstChild) {
      listEl.removeChild(listEl.lastChild);
    }
    Store.replaceSelectionList((m.list));
    let elements = Store.getSelectionList();
    elements.forEach((el) => {
      var wrapper = document.createElement('div');
      var li = document.createElement('li');
      var btn = document.createElement('button');
      li.setAttribute('onclick', 'deleteSelf(this)');
      li.setAttribute('id', el.id);
      li.innerHTML = el.name;
      btn.innerHTML = '>';
      wrapper.appendChild(li);
      wrapper.appendChild(btn);
      btn.setAttribute('onclick', `goToLayer('${el.id}')`)
      listEl.appendChild(wrapper);
    });
  }
}
