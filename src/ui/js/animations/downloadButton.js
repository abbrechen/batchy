// Import the entire module under the global identifier `rive`
import * as rive from "@rive-app/canvas";
// Alternatively, import only the specific parts you need
import { Rive } from "@rive-app/canvas";

/* RIVE */
// In your plugin's UI code (frontend)

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
      canvas: document.getElementById("riveTest"),
      autoplay: true,
      stateMachines: "State Machine 1",
      onLoad: () => {
        // r.resizeDrawingSurfaceToCanvas();
      },
    });
  })
  .catch(error => {
    console.error("Error loading .riv file:", error);
  });



/* === */
