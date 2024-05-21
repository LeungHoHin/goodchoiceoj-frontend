<template>
  <a-form :model="form" :style="{ width: '800px' }" @submit="handleSubmit">
    <a-form-item field="name" tooltip="请输入想更改的用户名" label="用户名">
      <a-input v-model="form.username" placeholder="请输入要更改的用户名..." />
    </a-form-item>
    <a-form-item>
      <a-button html-type="submit">提交</a-button>
    </a-form-item>
  </a-form>
  <a-result :status="null" title="更多功能正在开发中">
    <template #icon>
      <img src="../../assets/goodchoiceOJLogo.png" />
    </template>
  </a-result>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const form = reactive({
  username: "",
});

const router = useRouter();

const handleSubmit = async () => {
  const currentUser = await UserControllerService.getLoginUserUsingGet();
  if (currentUser == null) {
    message.error("未登录");
    router.push("/user/login");
  }

  const userUpdateRequest = {
    id: currentUser.data?.id,
    userName: form.username,
  };

  const res = await UserControllerService.updateUserUsingPost(
    userUpdateRequest
  );
  if (res) {
    message.success("修改成功");
    router.push("/");
  } else {
    message.error("修改失败");
  }
};
</script>

<style scoped></style>
