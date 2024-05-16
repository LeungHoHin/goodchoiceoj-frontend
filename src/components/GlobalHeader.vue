<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="0px">
      <div></div>
    </a-col>
    <a-col flex="auto">
      <div>
        <a-menu
          class="headerMenu"
          mode="horizontal"
          :selected-keys="selectedKeys"
          @menu-item-click="doMenuClick"
        >
          <a-menu-item
            key="0"
            :style="{ padding: 0, marginRight: '38px' }"
            disabled
          >
            <div class="title-bar">
              <img class="logo" src="../assets/goodchoiceOJLogo.png" />
              <div class="title">良好选OJ</div>
            </div>
          </a-menu-item>
          <a-menu-item v-for="item in visibleRoutes" :key="item.path"
            >{{ item.name }}
          </a-menu-item>
        </a-menu>
      </div>
    </a-col>
    <a-col flex="100px" @click="toLoginView">
      <div>
        {{ store.state.user?.loginUser?.userName ?? "未登录,点我登录" }}
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

const router = useRouter();

const selectedKeys = ref(["/"]);
const store = useStore();
const visibleRoutes = computed(() => {
  return routes.filter((item, inxex) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    //根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

const doMenuClick = (key: string) => {
  router.push(key);
};

const toLoginView = () => {
  router.push("/user/login");
};

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "良好选管理员",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 1000);
</script>

<style scoped>
#globalHeader {
}

.title-bar {
  display: flex;
  align-items: center;
}

.logo {
  height: 56px;
}

.headerMenu {
  font-size: 20px;
}

.title {
  font-size: 24px;
  color: black;
  margin-left: 8px;
}
</style>
