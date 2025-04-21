import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useStore } from "./stores/store.ts";
//import vue3GoogleLogin from 'vue3-google-login'

// Create the Pinia instance
const pinia = createPinia()
// Register the plugin with Pinia
pinia.use(piniaPluginPersistedstate)

// Create Vue app
const app = createApp(App);
app.use(pinia);

// Initialize the beverage store before mounting the app
const store = useStore();

// Initialize the store and then mount the app
store.init().then(() => {
  app.mount('#app');
}).catch((error: any) => {
  console.error('Failed to initialize the app:', error);
});