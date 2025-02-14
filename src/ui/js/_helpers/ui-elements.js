const downloadButton = document.getElementById('download-button');
const selectionListButton = document.getElementById('selection-list-button');
const selectionList = document.querySelector('.export-area > ul');
const dateFormatObj = document.getElementById('dateFormat');
const fileFormatObj = document.getElementById('fileFormat');
const scalingObj = document.getElementById('scaling');
const exportFrameSize = document.getElementById('exportFrameSize');
const input = document.getElementById('name');
const clearInputButton = document.getElementById('clearInput');
const cursor = document.getElementById('cursor');
const objectSize = document.getElementById('object-size');
const frameSize = document.getElementById('frame-size');
const frameSizeOption = document.getElementById('frame-size-option');
const username = document.getElementById('username');
const toggleBarItem = document.getElementById('toggleBarItem');
const body = document.querySelector('body');
const controls = document.getElementById('controls');
const collapsed = document.getElementById('collapsed');
const expanded = document.getElementById('expanded');
const notification = document.getElementById('notification');

export {
  downloadButton,
  selectionListButton,
  selectionList,
  dateFormatObj,
  fileFormatObj,
  scalingObj,
  exportFrameSize,
  input,
  clearInputButton,
  cursor,
  objectSize,
  frameSize,
  frameSizeOption,
  username,
  toggleBarItem,
  body,
  controls,
  collapsed,
  expanded,
  notification
}
