<template>
  <a-layout class="main-layout">
    <a-layout-header class="header">
      <HeaderNav :current-user="currentUser" />
    </a-layout-header>
    <a-layout-content class="content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'

const currentUser = reactive({
  username: 'admin',
  avatar: ''
})
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
}

.header {
  background: #fff;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: fixed;
  width: 100%;
  z-index: 100;
}

.content {
  margin-top: 64px;
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
}
</style>
