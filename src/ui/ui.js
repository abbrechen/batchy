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
// toggle click to show/hide the options
ui.toggleBarItem.addEventListener('click', () => {
  let pluginMessage;
  if (controls) {
    pluginMessage = JSON.stringify({
      type: 'resize',
      uiWindowValue: -ui.controls.offsetHeight,
    })

    ui.controls.style.display = 'none';
    ui.expanded.style.display = 'block';
    ui.collapsed.style.display = 'none';

  } else {
    pluginMessage = JSON.stringify({
      type: 'resize',
      uiWindowValue: ui.controls.offsetHeight,
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
  adjustFontSize();
}
window.addTextToInput = addTextToInput;

const adjustFontSize = () => {
  const input = ui.input;

  // Reset to the base size if input is empty
  if (!input.value) {
    input.style.fontSize = "24px";
    return;
  }

  // Get the available width inside the input field
  let availableWidth = input.clientWidth;

  // Create a hidden span element for text measurement
  let span = document.createElement("span");
  span.style.visibility = "hidden";
  span.style.position = "absolute";
  span.style.whiteSpace = "nowrap";

  // Use the base font size (24px) for the measurement
  span.style.fontSize = "24px";
  // Copy the input's font-family and font-weight to the span
  let computedStyle = window.getComputedStyle(input);
  span.style.fontFamily = computedStyle.fontFamily;
  span.style.fontWeight = computedStyle.fontWeight;

  span.innerText = input.value;
  document.body.appendChild(span);

  // Get the width of the text at the base font size (24px)
  let textWidth = span.offsetWidth;
  document.body.removeChild(span);

  // Calculate the ratio to determine the new font size.
  // If the text fits, ratio will be > 1, so we cap it at 1.
  let ratio = availableWidth / textWidth;
  let newSize = 24 * Math.min(1, ratio);

  // Ensure the font size doesn't go below 12px
  if (newSize < 12) {
    newSize = 12;
  }

  // Set the input font size to the new calculated size
  input.style.fontSize = newSize + "px";
}

window.adjustFontSize = adjustFontSize;

// clear the name input field
ui.clearInputButton.addEventListener('click', () => {
  // setCursorPosition();
  ui.input.value = '';
  checkDuplicatedNames(ui.input.value);
  adjustFontSize();
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
