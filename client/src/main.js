import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';
import './assets/main.css';
import './assets/components.css';
import './assets/home.css';
import './assets/auth.css';

createApp(App).use(pinia).use(router).mount('#app');