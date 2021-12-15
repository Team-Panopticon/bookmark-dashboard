import { createApp } from "vue";
import Popup from "./popup/PopUp.vue";
import NewTab from "./newtab/NewTab.vue";
import vuetify from "@/plugins/vuetify";

createApp(NewTab).use(vuetify).mount("#app");
