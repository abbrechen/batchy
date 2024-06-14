// ======
// Single file export functionality
// ======

import { fileFormat } from "./_helpers/file-format";

// SINGLE FILE EXPORT
const downloadSingleFile = (file) => {

  // the blob type is file specific
  let blob = new Blob(file.binaryData, fileFormat(file.format));

  // create and click a temporary link to download the Blob
  const blobURL = window.URL.createObjectURL(blob);
  const linkEl = document.createElement('a');
  linkEl.href = blobURL;
  linkEl.download = `${file.name}.${file.format}`;
  linkEl.click();
  linkEl.setAttribute('download', `${file.name}.${file.format}`);

  // clean up the blobURL and link element
  window.URL.revokeObjectURL(blobURL);
  linkEl.remove();
}
window.downloadSingleFile = downloadSingleFile;
