import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
//import vue3GoogleLogin from 'vue3-google-login'

// Create the Pinia instance
const pinia = createPinia()

// Register the plugin with Pinia
pinia.use(piniaPluginPersistedstate)

// Use pinia instance and mount the app
const app = createApp(App)
  app.use(pinia)
  /* NOT FULLY IMPLEMENTED YET
  app.use(vue3GoogleLogin, {
    clientId: 'YOUR_GOOGLE_CLIENT_ID'
  })
    */
  app.mount('#app')
