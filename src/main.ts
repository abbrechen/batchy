import { createApp } from 'vue';
import App from './App.vue';

console.log('Starting Vue app...');

createApp(App).mount('#app');

console.log('Vue app mounted.', Math.random());
