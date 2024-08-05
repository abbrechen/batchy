// ======
// This file handles the UI interactions and imports UI related stuff like the styles.scss
// UI reactivity is handled in the reactivity.js file
// ======

import '../../node_modules/reset-css/sass/_reset.scss';
import './styles.scss';
import * as ui from './js/_helpers/ui-elements';
import { setCursorPosition } from './js/reactivity';
import Store from './js/store';

document.addEventListener('DOMContentLoaded', () => {
  ui.input.focus();
});

document.addEventListener('keydown', () => {
  ui.input.focus();
});

let exportBarOpen = true;
// toggle click to show/hide the export options bar
ui.toggleBarItem.addEventListener('click', () => {
  let pluginMessage = JSON.stringify({
    type: 'resize',
    subtract: ui.optionsBar.offsetWidth
  })
  if (exportBarOpen) {
    ui.optionsBar.style.display = 'none';
    // ui.body.style.gridTemplateColumns = '0fr 0.1fr 3fr';
    ui.toggleBarItem.style.transform = 'scale(-100%)';
    ui.toggleBarItem.style.marginLeft = '24px';
    ui.toggleBarItem.classList.add('collapsed');
    ui.toggleBarItem.classList.remove('expanded');
  } else {
    ui.optionsBar.style.display = 'block';
    // ui.body.style.gridTemplateColumns = '1fr 0.1fr 3fr';
    ui.toggleBarItem.style.transform = 'scale(100%)';
    ui.toggleBarItem.style.marginLeft = '0';
    ui.toggleBarItem.classList.remove('collapsed');
    ui.toggleBarItem.classList.add('expanded');
  }
  exportBarOpen = !exportBarOpen;
  parent.postMessage({
    pluginMessage
  }, '*');
});

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
      // myField.value += myValue;
      const span = document.createElement('span');
      span.classList.add('syntax')
      span.textContent = myValue;
      span.setAttribute('contenteditable', true);
      myField.value += span
    }
  }

  function createSpan(text, highlight) {
    var span = document.createElement('span');
    if (highlight) {
      span.textContent = text;
      span.classList.add('syntax');
    } else {
      span.textContent = '';
    }
    return span;
  }

  insertAtCursor(ui.input, text)
  // setCursorPosition();
  // input.value += text
}
window.addTextToInput = addTextToInput;

// clear the name input field
ui.clearInputButton.addEventListener('click', () => {
  ui.input.value = '';
  // setCursorPosition();
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

ui.selectionListButton.addEventListener('click', () => {
  const pluginMessage = JSON.stringify({
    type: 'add-to-selection-list'
  })
  parent.postMessage({
    pluginMessage
  }, '*');
});

function deleteSelf(item) {
  var list = Store.getSelectionList();
  var listObj = list.find((el) => { return el.id == item.getAttribute('id') });
  // const listEl = ui.selectionList;
  // listEl.removeChild(item);
  const pluginMessage = JSON.stringify({
    type: 'remove-from-selection-list',
    itemToDelete: listObj
  })
  parent.postMessage({
    pluginMessage
  }, '*');
}
window.deleteSelf = deleteSelf;
