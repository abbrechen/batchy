// ======
// Multi file export functionality. Files get bundled as a zip
// ======

import { byteDataToBlob } from "./_helpers/byte-to-blob";

// MULTIPLE FILE EXPORT AS ZIP
const downloadZip = async (files) => {

  const zip = new JSZip();

  // each asset in the bundle will be added as seperated images to the zip
  files.forEach(file => {
    zip.file(`${file.name}.${file.format}`, byteDataToBlob(file.binaryData[0], file.format), { base64: true });
  });

  // zip file will be generated here
  zip.generateAsync({ type: 'blob' })
    .then((content) => {
      const zipName = 'assets';

      // create and click a temporary link to download the Blob
      const blobURL = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.className = 'button button--primary';
      link.href = blobURL;
      link.download = `${zipName}.zip`
      link.click()
      link.setAttribute('download', `${zipName}.zip`);

      // clean up the blobURL and link element
      window.URL.revokeObjectURL(blobURL);
      link.remove();
    });
};
window.downloadZip = downloadZip;
