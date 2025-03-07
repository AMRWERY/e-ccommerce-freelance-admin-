import "./assets/main.css";

import { createApp } from "vue";

//pinia
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

//flowbite
import directives from './directives/v-flowbite';
app.directive('flowbite', directives);

//i18n
import i18n from "@/plugins/i18n";

//vee-validate
import veeValidatePlugin from "@/plugins/vee-validate";

//iconify-icon
import "iconify-icon";

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(veeValidatePlugin);

app.mount("#app");
