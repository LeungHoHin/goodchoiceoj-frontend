import { createStore } from "vuex";
import user from "@/store/user";

export default createStore({
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    user,
  },
});
