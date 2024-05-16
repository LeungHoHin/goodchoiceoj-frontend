<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header"> </a-layout-header>
      <a-layout-content class="content用户">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://github.com/LeungHoHin" target="_blank"
          >良好选的github</a
        >
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
}

.header {
  box-shadow: #eee 2px 2px 5px;
}

.content {
  padding: 20px;
}

.footer {
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script setup lang="ts"></script>
