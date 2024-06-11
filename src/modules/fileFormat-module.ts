/*
======
This file manages the export settings for Figma's "exportAsync" function
https://www.figma.com/plugin-docs/api/properties/nodes-exportasync/
======
*/

export async function fileFormat(format: number, scaling: number): Promise<ExportSettings> {
  switch (format) {
    case 0:
      return {
        format: 'PNG',
        constraint: { type: 'SCALE', value: scaling }
      }
    case 1:
      return {
        format: 'JPG',
        constraint: { type: 'SCALE', value: scaling }
      }
    case 2:
      return {
        format: 'SVG'
      }
    case 3:
      return {
        format: 'PDF'
      }
    default:
      return {
        format: 'PNG',
        constraint: { type: 'SCALE', value: scaling }
      }
  }
}
