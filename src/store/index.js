import { createStore } from "vuex";
import userId from "./modules/userId";

export default createStore({
  modules: {
    userId,
  },
});
