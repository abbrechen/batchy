// import DateFormatter from '@date-js/date-formatter';

const message = (name: string) => {
  let date: string;
  let layerName: string;
  let exportName: string = '';
  let testName: string = name;

  if(name.includes('{{date}}')) {
    console.log('date condition triggered')
    /* --- DATE FORMAT 01 --- */
    const dateObj = new Date();
    var year: string|number;
    var month: string|number;
    var day: string|number
    year = dateObj.getFullYear() % 100;
    month = dateObj.getMonth() + 1;
    day = dateObj.getDay();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    date = `${year}-${month}-${day}`;

    /* --- DATE FORMAT 01 --- */

    exportName += date;
    testName.replace('{{date}}', date);
  }

  if(name.includes('{{name}}')) {
    console.log('name condition triggered')
    layerName = figma.currentPage.selection[0].name;

    exportName += layerName;
    testName.replace('{{name}}', layerName)
  }
  // return `name module has been loaded with the message: ${msg}`;
  return exportName;
  };
  
export default message;
