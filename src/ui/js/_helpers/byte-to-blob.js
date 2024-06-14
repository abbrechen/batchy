// ======
// the byteDataToBlob() is used in the zip creation for multi export
// ======

import { fileFormat } from "./file-format";

export function byteDataToBlob(byteData, format) {
  return new Blob([new Uint8Array(byteData)], fileFormat(format));
}
