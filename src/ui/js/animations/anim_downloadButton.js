// Import the entire module under the global identifier `rive`
import * as rive from "@rive-app/webgl2";
// Alternatively, import only the specific parts you need
import { Rive } from "@rive-app/canvas";

import Store from '../store';

/* RIVE */
// In your plugin's UI code (frontend)

let selectionList = Store.getSelectionList();

// Construct a URL relative to your HTML file's location
// Import the .riv file. Webpack will replace this with the URL to the bundled asset.
import downloadButtonRivUrl from '../../assets/riv/downloadButton.riv';

fetch(downloadButtonRivUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.arrayBuffer();
  })
  .then(buffer => {
    const r = new rive.Rive({
      buffer: buffer,
      canvas: document.getElementById("rive-download-button"),
      autoplay: true,
      stateMachines: "main",
      onLoad: () => {
        // r.resizeDrawingSurfaceToCanvas();
        const inputs = r.stateMachineInputs('main');
        const okTrigger = inputs.find(i => i.name === 'ok');
        const errorTrigger = inputs.find(i => i.name === 'error');
        const workingTrigger = inputs.find(i => i.name === 'working');

        let isSelectionEmpty = null;
        let selectionListLength = 0;

        const setTriggers = () => {
          if(isSelectionEmpty && selectionListLength <= 0) {
            errorTrigger.fire();
          } else if(isSelectionEmpty && selectionListLength > 0) {
            okTrigger.fire();
          } else if(!isSelectionEmpty && selectionListLength <= 0) {
            okTrigger.fire();
          }
        }

        isSelectionEmpty = Store.getIsSelectionEmpty();
        selectionListLength = Store.getSelectionList().length;
        setTriggers();

        const isSelectionEmptyListener = (property, newValue) => {
          if(property === 'isSelectionEmpty') {
            isSelectionEmpty = newValue;
            setTriggers();
          }
        }

        const selectionListListener = (property, newValue) => {
          if(property === 'selectionList') {
            selectionListLength = newValue.length;
            setTriggers();
          }
        }

        Store.addListener(isSelectionEmptyListener);
        Store.addListener(selectionListListener);
      },
    });
  })
  .catch(error => {
    console.error("Error loading .riv file:", error);
  });

/* === */
