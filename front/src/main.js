import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores/index';
import '@/assets/tailwind.css';

import { useUserStore } from './stores/users';

const app = createApp(App);

app.use(pinia);
app.use(router);

(async () => {
  await useUserStore().getUserHandler();
})();

app.mount('#app');
