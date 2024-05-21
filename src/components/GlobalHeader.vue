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
    <a-col flex="100px">
      <a-space>
        <!--        <a-link-->
        <!--          >{{ store.state.user?.loginUser?.userName ?? "点我登录" }}-->
        <!--        </a-link>-->
        <a-button type="primary" @click="handleClick"
          >{{ store.state.user?.loginUser?.userName ?? "点我登录" }}
        </a-button>
        <a-drawer
          :width="340"
          :visible="visible"
          @ok="handleOk"
          @cancel="handleCancel"
          unmountOnClose
          height="340px"
          :ok-text="okText"
          cancel-text="关闭"
          hide-cancel
        >
          <template #title> 个人名片</template>
          <div>
            <a-card
              class="userCard"
              :style="{ width: '300px' }"
              :title="store.state.user?.loginUser?.userName ?? '尚未登录'"
            >
              <template #extra>
                <a-link @click="toUserInfo">个人中心</a-link>
              </template>
              {{
                "权限：" + store.state.user?.loginUser?.userRole ?? "尚未登录"
              }}
            </a-card>
            <a-card
              class="guideCard"
              :style="{ width: '300px' }"
              title="良好选OJ使用方法"
              hoverable
            >
              <a-list>
                <template #header> 创建题目</template>
                <a-list-item>在顶部输入题目标题</a-list-item>
                <a-list-item
                  >输入题目标签后按下回车即可添加一个标签
                </a-list-item>
                <a-list-item
                  >题目和描述和题目答案均可以用MarkDown格式进行编辑
                </a-list-item>
                <a-list-item>可以添加多个输入输出用例</a-list-item>
              </a-list>
              <a-list>
                <template #header> 做题</template>
                <a-list-item
                  >一定需要编写名为Main的类，名且Main类中需含有main方法。输入用例会以main方法的参数形式运行（参考答案格式）
                </a-list-item>
                <a-list-item
                  >输出用例采用控制台输出的方式进行输出，如System.out.println(输出用例);
                </a-list-item>
                <a-list-item
                  >题目和描述和题目答案均可以用MarkDown格式进行编辑
                </a-list-item>
                <a-list-item>可以添加多个输入输出用例</a-list-item>
              </a-list>
            </a-card>
            <a-card
              class="exampleCard"
              :style="{ width: '300px' }"
              title="示例管理员"
            >
              账号：admin <br />密码：12345678
            </a-card>
            <a-card
              class="authorCard"
              :style="{ width: '300px' }"
              title="作者名片"
            >
              邮箱：leunghohin@163.com <br />QQ：1210469738
            </a-card>
          </div>
        </a-drawer>
      </a-space>
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
import { UserControllerService } from "../../generated";
import message from "@arco-design/web-vue/es/message";

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

const toUserInfo = () => {
  if (store.state.user.loginUser.userRole == "notLogin") {
    router.push("/user/login");
  } else {
    router.push("/user/info");
  }
};

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "良好选管理员",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 1000);

const logout = async () => {
  const res = await UserControllerService.userLogoutUsingPost();
  if (res.data) {
    message.success("注销成功");
    location.reload();
  } else {
    message.success("注销失败");
  }
};

const visible = ref(false);
// const hideCancel = ref(false);

// onMounted(() => {
//   if (store.state.user.loginUser.userRole == "notLogin") {
//     hideCancel.value = true;
//   }
// });

const okText =
  store.state.user.loginUser.userRole == "notLogin" ? "登录" : "注销";

const handleClick = () => {
  visible.value = true;
};
const handleOk = () => {
  visible.value = false;
  if (store.state.user.loginUser.userRole == "notLogin") {
    toLoginView();
  } else {
    logout();
  }
};
const handleCancel = () => {
  visible.value = false;
};
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

.guideCard {
  transform: translateY(-4px);
}

.exampleCard {
  transform: translateY(-4px);
}

.userCard {
  transform: translateY(-4px);
}

.authorCard {
  transform: translateY(-4px);
}
</style>
