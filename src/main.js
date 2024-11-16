import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';  // Import Element Plus styles
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

// Create the Vue app
const app = createApp(App);

// Use Vuetify and Element Plus
app.use(vuetify);
app.use(ElementPlus);


// Mount the app
app.mount('#app');
