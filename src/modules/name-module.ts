// import DateFormatter from '@date-js/date-formatter';

const message = (name: string) => {
  let date;
  let layerName;

  if(name.includes('{{date}}')) {
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
  }
  console.log(date)
  // return `name module has been loaded with the message: ${msg}`;
  };
  
export default message;
