import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Create the Pinia instance
const pinia = createPinia()

// Register the plugin with Pinia
pinia.use(piniaPluginPersistedstate)

// Use pinia instance and mount the app
createApp(App)
  .use(pinia)
  .mount('#app')