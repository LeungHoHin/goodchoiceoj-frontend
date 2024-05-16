<template>
  <div class="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<style scoped>
#app {
}
</style>
<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";

import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const doInit = () => {
  console.log("全局初始化函数被调用了");
};

onMounted(() => {
  doInit();
});
</script>
