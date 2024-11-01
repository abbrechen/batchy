import message from './modules/name-module';
import { parentSize } from './modules/parentSize-module';
import { fileFormat } from './modules/fileFormat-module';
import { preview } from './modules/preview-module';
import Store from './modules/store-module'
import addSuffixToDuplicates from './modules/duplicates-module';

// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".

// Can I receive the DOM body size to use it for the plugin window?
// That way, the window would be dynamic

let uiWidth = 953;
let uiHeight = 642;

figma.showUI(__html__, {
  themeColors: true,
  width: uiWidth,
  height: uiHeight
});


// figma.closePlugin();
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
// figma.ui.onmessage =  (msg: {type: string, count: number}) => {

interface exportObj {
  name: string,
  binaryData: object,
  format: string
}

interface exportBundle extends Array<exportObj> { }

var exportBundle: exportBundle = [];

const checkSelection = () => {
  const selection = figma.currentPage.selection;
  const selectionList = Store.getSelectionList();
  const isSelectionEmpty = () => {
    if(selection.length <= 0) {
      Store.setIsSelectionEmpty(true);
      return true;
    } else {
      Store.setIsSelectionEmpty(false);
      return false;
    }
  };
  const isSelectionListEmpty = () => {
    if(selectionList.length <= 0) {
      return true;
    } else {
      return false;
    }
  };
  figma.ui.postMessage({ type: 'selection-empty', isSelectionEmpty: isSelectionEmpty(), isSelectionListEmpty: isSelectionListEmpty() });
}
// ====== Observe if one or more layers are selected
figma.on('selectionchange', () => {
  checkSelection();
});
figma.on('run', () => {
  checkSelection();
});
// ======

// send user name to frontend
figma.ui.postMessage({ type: 'user', user: figma.currentUser?.name });
// 

// General message receiver
figma.ui.onmessage = (msg: string) => {
  const Msg = JSON.parse(msg);
  // get all config data to bind them to the image information
  if (Msg.type === '01-collect-data') {
    (async () => {
      // this variable manages the exportAsync settings
      let settings: ExportSettings;
      settings = await fileFormat(Msg.fileFormat, Msg.scaling);
      var selection;
      var selectionList = Store.getSelectionList();
      var isSelectionEmpty = Store.getIsSelectionEmpty();
      if (selectionList.length > 0 && isSelectionEmpty) {
        selection = selectionList;
      } else {
        selection = figma.currentPage.selection;
      }
      // get the image binary data
      for (let i = 0; i < selection.length; i++) {
        var bytes;
        if (Msg.isExportFrameSizeChecked) {
          bytes = await parentSize([selection[i]], settings);
        } else {
          bytes = await selection[i].exportAsync(settings);
        }
        var binaryData = [];
        binaryData.push(bytes);
        // create an asset set, including the image and config data and push it to the bundle, that will later be exported
        var name = message(Msg.name, i, Msg.dateFormat, Msg.scaling);
        exportBundle.push({
          name,
          binaryData,
          format: settings.format
        })
      }

      // Start the next step by providing config+image information to the frontend
      const checkedExportBundle = addSuffixToDuplicates(exportBundle, 'name');
      figma.ui.postMessage({ type: '02-export-bundle', exportBundle: checkedExportBundle });
      exportBundle = [];
    })();
  } else if (Msg.type === 'resize') {
    figma.ui.resize(uiWidth, uiHeight + Msg.subtract);
  } else if (Msg.type === 'add-to-selection-list') {
    const selection = figma.currentPage.selection;
    // let list = preview(selection);
    selection.forEach((item: SceneNode) => {
      Store.addToSelectionList(item);
    });
    let list: any[]= new Array;
    Store.getSelectionList().forEach((item: SceneNode) => {
      let listItem = {
        name: item.name,
        id: item.id
      }
      list.push(listItem);
    });
    figma.ui.postMessage({ type: 'receive-preview', list });
  } else if (Msg.type === 'remove-from-selection-list') {
    Store.removeFromSelectionList(Msg.itemToDelete);
    let list: any[]= new Array;
    Store.getSelectionList().forEach((item: SceneNode) => {
      let listItem = {
        name: item.name,
        id: item.id,
      }
      list.push(listItem);
    });
    figma.ui.postMessage({ type: 'receive-preview', list });
    checkSelection();
  } else if (Msg.type === 'go-to-layer') {
    // USE LAYER ID TO JUMP TO LAYER AND MAKE IT SELECTION
    let selectionList = Store.getSelectionList();
    let el = selectionList.find((item) => { return item.id === Msg.goToLayerID });
    if (el !== undefined) {
      // figma.currentPage.selection = figma.currentPage.selection.concat(el)
      let selection = figma.currentPage.selection = [el];
      figma.viewport.scrollAndZoomIntoView(selection);
    } else {
      console.error('no selection list items')
    }
  } else if (Msg.type === 'body-size') {
    // receives the body size to generate dynamic window dimensions
    uiWidth = Msg.bodyWidth;
    uiHeight = Msg.bodyHeight + 10
    figma.ui.resize(uiWidth, uiHeight);
  } else {
    console.error(`unknown onmessage type "${Msg.type}"`);
  }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};
