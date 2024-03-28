// import DateFormatter from '@date-js/date-formatter';

const message = (name: string, index: number) => {
  let date: string;
  let layerName: string;
  let exportName: string = name;

  if(name.includes('{{date}}')) {
    /* --- DATE FORMAT 01 --- */
    const newDate = new Date();
    var year: string|number;
    var month: string|number;
    var day: string|number
    year = newDate.getFullYear() % 100;
    month = newDate.getMonth() + 1;
    day = newDate.getDay();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    date = `${year}-${month}-${day}`;

    /* --- DATE FORMAT 01 --- */

    exportName = exportName.replace('{{date}}', date);
  }

  if(name.includes('{{name}}')) {
    layerName = figma.currentPage.selection[index].name;

    exportName = exportName.replace('{{name}}', layerName)
  }
  // return `name module has been loaded with the message: ${msg}`;
  return exportName;
  };
  
export default message;
