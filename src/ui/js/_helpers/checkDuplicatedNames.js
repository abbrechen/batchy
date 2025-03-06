import * as ui from './ui-elements';
import { Notification } from './notification';

const overrideAssetsNotification = new Notification();
const characterNotficiation = new Notification();

const invalidChars = ["\\", "/", ":", "*","?", '"', "<", ">", "|"]

const check = (value) => {

  if (value.includes('{{layerName}}') ||  value.includes('{{index}}') || value.length <= 0) {
    overrideAssetsNotification.text("");
    overrideAssetsNotification.remove();
  } else if (value.includes('{{topLevel}}')) {
    overrideAssetsNotification.create('warning');
    overrideAssetsNotification.text('Assets could have the same name and would override each other');
  } else {
    overrideAssetsNotification.create('critical');
    overrideAssetsNotification.text('Assets will have the same name and override each other');
  }

  const isCharsMatched = value.split("").map(char => invalidChars.includes(char)).includes(true);

  if(isCharsMatched) {
    const matchedChars = value.split("").filter(char => invalidChars.includes(char));
    characterNotficiation.create('critical');
    characterNotficiation.text(`Asset names with these characters will not be saved correctly on Mac/Win: ${matchedChars.join(', ')}`);
  } else if(!isCharsMatched || value.length <= 0) {
    characterNotficiation.text("");
    characterNotficiation.remove();
  }
}

export function checkDuplicatedNames(receivedValue) {
  let value = '';
  if (receivedValue || receivedValue === '') {
    check(receivedValue);
  } else {
    ui.input.addEventListener('input', (event) => {
      value = event.target.value; // Use event.target.value to get the latest value
      check(value)
    });
  }
}
