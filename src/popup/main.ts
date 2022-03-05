import { createApp } from "vue";
import Popup from "./PopUp.vue";
import vuetify from "@/plugins/vuetify";

createApp(Popup).use(vuetify).mount("#popup");
