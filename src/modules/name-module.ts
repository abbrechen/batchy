// import DateFormatter from '@date-js/date-formatter';
import Store from './store-module';
import getMainParent from './_helpers/main-parent';

const message = (name: string, index: number, dateFormat: number, scaling: number) => {
  let date: string;
  let layer: SceneNode;
  let layerName: string;
  let topLevelName: string;
  let fileName: string;
  let exportName: string = name;

  const prefix: string = '\\$';

  function containsWord(keyword: string): boolean {
    // Remove spaces from the name (but keep the prefix and other special chars)
    const cleanedName: string = name.replace(new RegExp(`\\s`, 'g'), '');
    // Create a regular expression to match the keyword with the prefix and optional special chars
    const regex = new RegExp(`${prefix}[a-zA-Z0-9-_]*${keyword}[a-zA-Z0-9-_]*\\b`, 'gi');
    // Test the regex against the name without white spaces
    return regex.test(cleanedName);
  }

  function replaceWord(keyword: string, replacement: string): void {
    exportName = exportName.replace(new RegExp(`${prefix}${keyword}`, 'g'), replacement);
  }

  if (containsWord('date')) {
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

    replaceWord('date', date);
  }

  if (Store.getSelectionList().length > 0 && Store.getIsSelectionEmpty()) {
    layer = Store.getSelectionList()[index]
    layerName = layer.name;
  } else {
    layer = figma.currentPage.selection[index];
    layerName = layer.name;
  }

  if (containsWord('layer')) {
    replaceWord('layer', layerName);
  }

  if (containsWord('file')) {
    fileName = figma.root.name;
    replaceWord('file', fileName);
  }

  if (containsWord('scaling')) {
    replaceWord('scaling', `${scaling}x`)
  }

  if (containsWord('index')) {
    replaceWord('index', `${index + 1}`);
  }

  if (containsWord('user')) {
    const userName = figma?.currentUser?.name || '';
    replaceWord('user', userName);
  }

  if (containsWord('topLevel')) {
    topLevelName = getMainParent(layer)?.name ?? '';
    topLevelName === layerName ? topLevelName = '' : topLevelName;
    replaceWord('topLevel', topLevelName);
  }

  // return `name module has been loaded with the message: ${msg}`;
  return exportName;
};

export default message;
