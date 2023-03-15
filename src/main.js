import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import store from "./store";
import VueGoogleMaps from "@fawmi/vue-google-maps";

loadFonts();

createApp(App)
  .use(router)
  .use(vuetify)
  .use(store)
  .use(VueGoogleMaps, {
    load: {
      key: "AIzaSyDEJiW679Uw3p7X5xgQEamRU3agd2zWUAM",
    },
  })
  .mount("#app");
