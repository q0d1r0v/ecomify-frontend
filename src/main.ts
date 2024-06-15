// imports
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./routes/index";
import { Quasar, Loading } from "quasar";
import Vue3Toastify from "vue3-toastify";
import "./style.css";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";
import "vue3-toastify/dist/index.css";
import { createI18n } from "vue-i18n";

// import languages
import { uz } from "./locale/uz";
import { ru } from "./locale/ru";

const i18n = createI18n({
  locale: localStorage.getItem("lang") || "uz",
  legacy: false,
  messages: {
    uz,
    ru,
  },
});

createApp(App)
  .use(router)
  .use(Vue3Toastify)
  .use(Quasar, {
    plugins: {
      Loading,
    },
  })
  .use(i18n)
  .mount("#app");
