import message from './modules/name-module';
import { parentSize } from './modules/parentSize-module';

// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// figma.closePlugin();
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
// figma.ui.onmessage =  (msg: {type: string, count: number}) => {

interface exportObj {
  name: string,
  binaryData: object
}

interface exportBundle extends Array<exportObj> { }

var exportBundle: exportBundle = [];

// General message receiver
figma.ui.onmessage = (msg: string) => {
  const Msg = JSON.parse(msg);
  // get all config data to bind them to the image information
  if (Msg.type === '01-collect-data') {
    (async () => {
      var selection = figma.currentPage.selection;

      // get the image binary data
      for (let i = 0; i < selection.length; i++) {
        var bytes;
        if (Msg.isExportFrameSizeChecked) {
          bytes = await parentSize([selection[i]]);
        } else {
          bytes = await selection[i].exportAsync({
            format: 'PNG',
            constraint: { type: 'SCALE', value: 1 }
          });
        }
        var binaryData = [];
        binaryData.push(bytes);

        // create an asset set, including the image and config data and push it to the bundle, that will later be exported
        var name = message(Msg.name, i, Msg.dateFormat);
        exportBundle.push({
          name,
          binaryData
        })
      }

      // Start the next step by providing config+image information to the frontend
      figma.ui.postMessage({ type: '02-export-bundle', exportBundle });
      exportBundle = [];
    })();
  } else {
    console.error(`unknown onmessage type "${Msg.type}"`);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};
