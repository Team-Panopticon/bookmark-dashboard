import { createApp } from "vue";
import NewTab from "./NewTab.vue";
import vuetify from "@/plugins/vuetify";
import vfmPlugin from "vue-final-modal";

createApp(NewTab).use(vuetify).use(vfmPlugin).mount("#newtab");
