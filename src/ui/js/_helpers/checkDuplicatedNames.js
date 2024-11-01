import * as ui from './ui-elements';

const check = (value) => {
  if (value.includes('{{name}}') || value.length <= 0) {
    ui.notification.innerHTML = '';
    ui.notification.style.display = 'none';
  } else {
    ui.notification.innerHTML = 'Assets will have the same name and override each other';
    ui.notification.style.display = 'block';
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
