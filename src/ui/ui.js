// ======
// This file handles the UI interactions and imports UI related stuff like the styles.scss
// UI reactivity is handled in the reactivity.js file
// ======

import './styles.scss';
import * as ui from './js/_helpers/ui-elements';

  // this function adds syntax text to the input field
  const addTextToInput = (text) => {
    // this sub function adds the text to the cursor position.
    // used from https://stackoverflow.com/a/11077016
    function insertAtCursor(myField, myValue) {
      //IE support
      if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
      }
      //MOZILLA and others
      else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
          + myValue
          + myField.value.substring(endPos, myField.value.length);
      } else {
        myField.value += myValue;
      }
    }
    insertAtCursor(ui.input, text)
    // input.value += text
  }
  window.addTextToInput = addTextToInput;

  // clear the name input field
  ui.clearInputButton.addEventListener('click', () => {
    ui.input.value = '';
  });

  ui.downloadButton.addEventListener('click', () => {
    const dateFormat = ui.dateFormatObj.selectedIndex;
    const fileFormat = ui.fileFormatObj.selectedIndex;
    const scaling = ui.scalingObj.selectedIndex + 1;
    const isExportFrameSizeChecked = ui.exportFrameSize.checked;
    const pluginMessage = JSON.stringify({
      type: '01-collect-data',
      name: document.getElementById('name').value,
      dateFormat,
      fileFormat,
      scaling,
      isExportFrameSizeChecked
    })
    parent.postMessage({
      pluginMessage
    }, '*');
  });

