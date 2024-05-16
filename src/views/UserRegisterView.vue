<template>
  <div id="userLogin">
    <div class="logoAndName">
      <img class="logo" src="../assets/goodchoiceOJLogo.png" />
      <h2 class="name">良好选OJ</h2>
    </div>
    <a-form
      class="loginForm"
      :model="form"
      @submit="handleSubmit"
      label-align="left"
    >
      <a-form-item class="userAccountItem" field="userAccount" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item
        class="userPasswordItem"
        field="userPassword"
        label="密码"
        tooltip="密码不少于8位且不含特殊字符"
      >
        <a-input
          v-model="form.userPassword"
          placeholder="请输入密码"
          type="password"
        />
      </a-form-item>
      <a-form-item
        class="userPasswordItem"
        field="checkPassword"
        label="确认密码"
        tooltip="请保证两次输入的密码相同"
      >
        <a-input
          v-model="form.checkPassword"
          placeholder="请输入密码"
          type="password"
        />
      </a-form-item>
      <a-form-item class="submitItem">
        <a-button class="submitButton" type="primary" html-type="submit"
          >注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const form = reactive({
  checkPassword: "",
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);
const router = useRouter();
/**
 * 提交表单
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userRegisterUsingPost(form);
  if (res.code === 0) {
    alert("注册成功" + JSON.stringify(res.data));
    router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    message.error("注册失败，" + res.message);
  }
};
</script>

<style scoped>
#userLogin {
  height: 100vh;
  background: url("../assets/background.jpg");
}

.logoAndName {
  width: 600px;
  position: relative;
  left: 50%;
  right: 50%;
  padding-top: 60px;
}

.logo {
  height: 96px;
}

.name {
}

.loginForm {
  max-width: 480px;
  margin: 0 auto;
}

.userAccountItem {
}

.userPasswordItem {
}

.submitItem {
}

.submitButton {
  margin: 0 auto;
  height: 40px;
  width: 90px;
}
</style>
