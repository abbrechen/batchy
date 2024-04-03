import message from './modules/name-module';
// import JSZip from '../node_modules/@types/jszip';
const JsZip = require('jszip');

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

interface exportBundle extends Array<exportObj> {}

var exportBundle:exportBundle = [];

// figma.ui.onmessage = msg => {
//   console.log(msg.type)
//   if (msg.type === 'say-hello') {
//     console.log(msg.txt)
//     figma.ui.postMessage({type: 'say-hello', txt:'hello from TS'});
//   }
//   if (msg.type === 'say-bye') {
//     console.log(msg.txt)
//     figma.ui.postMessage({type: 'say-bye', txt:'bye from TS'});
//   }
// }

figma.ui.onmessage =  (msg: {type: string, name: string}) => {

  if(msg.type === 'collect-data') {
      (async () => {
        var selection = figma.currentPage.selection;

        for(let i = 0; i < selection.length; i++) {
          var bytes = await selection[i].exportAsync({
            format: 'PNG',
            constraint: { type: 'SCALE', value: 1 }
          });
          var binaryData = [];
          binaryData.push(bytes);
          var name = message(msg.name, i);
          exportBundle.push({
            name,
            binaryData
          })
        }
        // figma.ui.postMessage({binaryData, name});
        figma.ui.postMessage({type: 'export-bundle', exportBundle});
        exportBundle = [];
      })();
    } else {
      console.error('known onmessage type');
    }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};
