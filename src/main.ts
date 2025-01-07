import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { app as firebaseApp } from './services/firebase'
import './assets/main.css'

// Verify Firebase initialization
console.log('Firebase initialized with config:', {
  projectId: firebaseApp.options.projectId,
  authDomain: firebaseApp.options.authDomain,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
