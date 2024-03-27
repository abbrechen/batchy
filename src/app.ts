import message from './modules/name-module';

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

figma.ui.onmessage =  (msg: {download: boolean, name: string}) => {

  if(msg.download) {
      (async () => {
        var selection = figma.currentPage.selection[0];
        console.log('name from html: ', msg.name, 'name from func: ', message(msg.name));
        var bytes = await selection.exportAsync({
          format: 'PNG',
          constraint: { type: 'SCALE', value: 1 }
        });
        figma.ui.postMessage({bytes, name: message(msg.name)});
      })();
    } else {
      console.log('download is', msg.download)
    }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};
