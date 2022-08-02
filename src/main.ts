import {createApp} from 'vue'
import App from './App.vue'
// import './samples/node-api'
import vuetify from "./plugins/vuetify";
import {createPinia} from "pinia";
import router from "./router";
import {loadFonts} from "./plugins/webfontloader";

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(createPinia());

loadFonts()

app.mount('#app')
    .$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*')
    })
