// import JSZip from '../node_modules/@types/jszip';
// const JsZip = require('jszip');
// import {
//   BlobReader,
//   BlobWriter,
//   TextReader,
//   TextWriter,
//   ZipReader,
//   ZipWriter,
// } from '@zip.js/zip.js';

import JSZip from 'jszip';

var zip = new JSZip();

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

interface exportObj {
  name: string,
  // blob: Blob
  binaryData: object
}

interface exportBundle extends Array<exportObj> {}

var exportBundle:exportBundle = [];

const createBlob = (binaryData:any) => {
  return new Promise<Blob>((resolve, reject) => {
    if(binaryData) {
      var blob:Blob = new Blob(binaryData, {type: 'image/png'});
      resolve(blob)
    } else {
      reject('no binaryData found')
    }
  });
}

// figma.ui.onmessage =  (msg: {type: string, name: string, blobData:[]}) => {
figma.ui.onmessage =  (msg: string) => {
  const Msg = JSON.parse(msg);
  if(Msg.type === 'collect-data') {
      (async () => {
        var selection = figma.currentPage.selection;

        for(let i = 0; i < selection.length; i++) {
          var bytes = await selection[i].exportAsync({
            format: 'PNG',
            constraint: { type: 'SCALE', value: 1 }
          });
          var binaryData = [];
          binaryData.push(bytes);

          // createBlob(binaryData).then((blob) => {
          //   var name = message(msg.name, i);
          //   exportBundle.push({
          //     name,
          //     blob
          //   })
          // });

          var name = message(Msg.name, i);
          exportBundle.push({
            name,
            binaryData
          })
        }
        // figma.ui.postMessage({binaryData, name});
        figma.ui.postMessage({type: 'export-bundle', exportBundle});
        exportBundle = [];
      })();
    } else if (Msg.type === 'create-zip') {
      return new Promise(async resolve => {
        Msg.blobData.forEach((file: {name: string, blob: string}) => {
          console.log(file)
          // zip.file(`${file.name}.png`, blob);
          // zip.generateAsync({type: 'blob'}).then(content => {
          //   console.log(content)
          // })
        })
      })
    } else {
      console.error(`unknown onmessage type "${Msg.type}"`);
    }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};
