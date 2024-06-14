// ======
// The file format function returns the format type, used for the blob data
// ======
export function fileFormat(format) {
  switch (format) {
    case 'PNG':
      return {
        type: 'image/png'
      }
    case 'JPG':
      return {
        type: 'image/jpeg'
      }
    case 'SVG':
      return {
        type: 'image/svg+xml'
      }
    case 'PDF':
      return {
        type: 'application/pdf'
      }
    default:
      return {
        type: 'image/png'
      }
  }
}
