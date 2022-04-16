import { createApp } from "vue";
import NewTab from "./NewTab.vue";
import vuetify from "@/plugins/vuetify";
import vfmPlugin from "vue-final-modal";
import store from "./store/";
import { layoutDB } from "./utils/layoutDB";

const App = createApp(NewTab).use(vuetify).use(vfmPlugin).use(store);

const bootstrap = async () => {
  await layoutDB.initDB();
  App.mount("#newtab");
};

bootstrap();
