import './styles.scss';

console.log('Hello from test.js xxx');

function logMsg(text) {
  console.log(text)
};

// const test = document.getElementById('test');
// console.log('test.js is using ui.html:', test.innerText)

document.addEventListener('DOMContentLoaded', () => {
  console.log('Hello from test.js');
  const app = document.getElementById('app');
  if(app) {
    app.innerHTML = '<h1>Hello, Figma Plugin!</h1>';
  } else {
    console.error('#app not found')
  }
});
