import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import store from "./store";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import VueClientRecaptcha from "vue-client-recaptcha";
loadFonts();

createApp(App)
  .use(router)
  .use(vuetify)
  .use(store)
  .use(VueGoogleMaps, {
    load: {
      key: process.env.VUE_APP_MAP_KEY,
    },
  })
  .component("VueDatePicker", VueDatePicker)
  .component("VueClientRecaptcha", VueClientRecaptcha)
  .mount("#app");
