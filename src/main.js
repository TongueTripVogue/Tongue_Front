import "@/assets/style.css"; // tailwind 사용
import PrimeVue from "primevue/config";
import Lara from "@/presets/lara"; // import preset
import "primeicons/primeicons.css"; // icons

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ToastService from "primevue/toastservice";

const app = createApp(App);

app.use(PrimeVue, {
  unstyled: true,
  pt: Lara, //apply preset
});
app.use(router);
app.use(ToastService);

app.mount("#app");
