// import DateFormatter from '@date-js/date-formatter';

const message = (name: string, index: number, dateFormat: number, scaling: number) => {
  let date: string;
  let layerName: string;
  let fileName: string;
  let exportName: string = name;

  if (name.includes('{{date}}')) {
    /* --- DATE START --- */
    const newDate = new Date();
    var year: string | number;
    var year_short: string | number;
    var month: string | number;
    var day: string | number;

    year = newDate.getFullYear();
    year_short = year % 100
    month = newDate.getMonth() + 1;
    // Issue: Timezone is not calculated in.
    // Around the end of a day / a new day, the day date is wrong for countries like Germany
    day = newDate.getUTCDate();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    switch (dateFormat) {
      default:
        date = `${year_short}${month}${day}`;
      case 0:
        /* --- DATE FORMAT 01 --- */
        date = `${year_short}${month}${day}`;
        break;
      case 1:
        /* --- DATE FORMAT 02 --- */
        date = `${year}-${month}-${day}`;
        break;
      /* --- DATE FORMAT 03 --- */
      case 2:
        date = `${day}-${month}-${year}`;
        break;
      /* --- DATE FORMAT 04 --- */
      case 3:
        date = `${month}-${day}-${year}`;
    }

    /* --- DATE END --- */

    exportName = exportName.replace('{{date}}', date);
  }

  if (name.includes('{{name}}')) {
    layerName = figma.currentPage.selection[index].name;
    exportName = exportName.replace('{{name}}', layerName)
  }

  if (name.includes('{{file}}')) {
    fileName = figma.root.name;
    exportName = exportName.replace('{{file}}', fileName);
  }

  if (name.includes('{{scaling}}')) {
    exportName = exportName.replace('{{scaling}}', `${scaling}x`);
  }

  // return `name module has been loaded with the message: ${msg}`;
  return exportName;
};

export default message;
