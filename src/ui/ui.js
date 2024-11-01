// ======
// This file handles the UI interactions and imports UI related stuff like the styles.scss
// UI reactivity is handled in the reactivity.js file
// ======

import '../../node_modules/reset-css/sass/_reset.scss';
import './styles.scss';
import * as ui from './js/_helpers/ui-elements';
import { setCursorPosition } from './js/reactivity';
import Store from './js/store';
import { checkDuplicatedNames } from './js/_helpers/checkDuplicatedNames';

document.addEventListener('DOMContentLoaded', () => {
  ui.input.focus();

  // sends the body size to the backend to generate dynamic window dimensions
  const pluginMessage = JSON.stringify({
    type: 'body-size',
    bodyWidth: ui.body.offsetWidth,
    bodyHeight: ui.body.offsetHeight
  })
  parent.postMessage({
    pluginMessage
  }, '*');
});

document.addEventListener('keydown', () => {
  ui.input.focus();
  checkDuplicatedNames();
});

let controls = true;
// toggle click to show/hide the export options bar
ui.toggleBarItem.addEventListener('click', () => {
  let pluginMessage;
  // ui.body.style.display = 'flex';
  // ui.body.style.flexDirection = 'column';
  if (controls) {
    pluginMessage = JSON.stringify({
      type: 'resize',
      subtract: -ui.controls.offsetHeight,
    })

    ui.controls.style.display = 'none';
    ui.expanded.style.display = 'block';
    ui.collapsed.style.display = 'none';
  } else {
    pluginMessage = JSON.stringify({
      type: 'resize',
      subtract: ui.controls.offsetHeight,
    })

    ui.controls.style.display = 'grid';
    ui.expanded.style.display = 'none';
    ui.collapsed.style.display = 'block';
  }
  controls = !controls;
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
  checkDuplicatedNames(ui.input.value);
}
window.addTextToInput = addTextToInput;

// clear the name input field
ui.clearInputButton.addEventListener('click', () => {
  // setCursorPosition();
  ui.input.value = '';
  checkDuplicatedNames(ui.input.value);
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

function goToLayer(id) {
  const pluginMessage = JSON.stringify({
    type: 'go-to-layer',
    goToLayerID: id
  })
  parent.postMessage({
    pluginMessage
  }, '*');
}
window.goToLayer = goToLayer;
