import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      userName: null,
      userRole: ACCESS_ENUM.NOT_LOGIN,
    },
  }),
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getLoginUser({ commit, state }: any, playload: any) {
      //从远程获取登录信息
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0) {
        commit("updateUser", res.data);
      } else {
        commit("updateUser", {
          ...state.loginUser,
          userRole: ACCESS_ENUM.NOT_LOGIN,
        });
      }
    },
  },
  mutations: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    updateUser(state, playload) {
      state.loginUser = playload;
    },
  } as StoreOptions<any>,
};
