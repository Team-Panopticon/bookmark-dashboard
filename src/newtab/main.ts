import { createApp } from "vue";
import NewTab from "./NewTab.vue";
import vuetify from "@/plugins/vuetify";
import vfmPlugin from "vue-final-modal";
import contextmenu from "v-contextmenu";

createApp(NewTab).use(vuetify).use(vfmPlugin).use(contextmenu).mount("#newtab");
