import { createApp } from "vue";
import NewTab from "./NewTab.vue";
import vuetify from "@/plugins/vuetify";
import vfmPlugin from "vue-final-modal";
import store from "./store/";

createApp(NewTab).use(vuetify).use(vfmPlugin).use(store).mount("#newtab");
