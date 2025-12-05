<template>
  <div class="header-nav">
    <div class="logo">
      <img src="https://via.placeholder.com/32" alt="Logo" class="logo-img" />
      <span class="logo-text">核桃OJ后台</span>
    </div>
    
    <a-menu
      v-model:selectedKeys="selectedKeys"
      mode="horizontal"
      class="nav-menu"
    >
      <a-menu-item key="submissions">
        <router-link to="/submissions">全部提交</router-link>
      </a-menu-item>
      
      <a-menu-item key="content">
        <router-link to="/content">内容管理</router-link>
      </a-menu-item>
      
      <a-menu-item key="problems">
        <router-link to="/problems">全部题目</router-link>
      </a-menu-item>
      
      <a-menu-item key="problem-banks">
        <router-link to="/problem-banks">题库</router-link>
      </a-menu-item>
      
      <a-menu-item key="problem-lists">
        <router-link to="/problem-lists">题单</router-link>
      </a-menu-item>
      
      <a-menu-item key="contests">
        <router-link to="/contests">比赛</router-link>
      </a-menu-item>
      
      <a-menu-item key="groups">
        <router-link to="/groups">小组</router-link>
      </a-menu-item>
      
      <a-menu-item key="users">
        <router-link to="/users">用户</router-link>
      </a-menu-item>
      
      <a-menu-item key="tags">
        <router-link to="/tags">标签</router-link>
      </a-menu-item>

      <a-sub-menu key="create" title="创建">
        <a-menu-item key="create-problem-bank">创建题库</a-menu-item>
        <a-menu-item key="create-problem-list">创建题单</a-menu-item>
        <a-menu-item key="create-contest">创建比赛</a-menu-item>
        <a-menu-item key="create-group">创建小组</a-menu-item>
      </a-sub-menu>
      
      <a-sub-menu key="incentive" title="激励">
        <a-menu-item key="incentive-points">积分管理</a-menu-item>
        <a-menu-item key="incentive-badges">徽章管理</a-menu-item>
      </a-sub-menu>
      
      <a-sub-menu key="home-config" title="首页配置">
        <a-menu-item key="featured">核桃精选</a-menu-item>
        <a-menu-item key="banner">首页Banner</a-menu-item>
      </a-sub-menu>
    </a-menu>
    
    <div class="header-right">
      <a-select v-model:value="language" class="language-select" size="small">
        <a-select-option value="cpp">C++</a-select-option>
        <a-select-option value="java">Java</a-select-option>
        <a-select-option value="python">Python</a-select-option>
      </a-select>
      
      <a-dropdown>
        <div class="user-info">
          <a-avatar :size="28">
            {{ props.currentUser.username.charAt(0).toUpperCase() }}
          </a-avatar>
          <span class="username">{{ props.currentUser.username }}</span>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item key="profile">个人中心</a-menu-item>
            <a-menu-item key="settings">设置</a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout">退出登录</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  currentUser: {
    username: string
    avatar?: string
  }
}

const props = defineProps<Props>()

const route = useRoute()
const selectedKeys = ref<string[]>([''])
const language = ref('cpp')

// 根据路由更新选中的菜单项
watch(
  () => route.path,
  (path) => {
    const pathMap: Record<string, string> = {
      '/': 'home',
      '/submissions': 'submissions',
      '/content': 'content',
      '/problems': 'problems',
      '/problem-banks': 'problem-banks',
      '/problem-lists': 'problem-lists',
      '/contests': 'contests',
      '/groups': 'groups',
      '/users': 'users',
      '/tags': 'tags'
    }
    selectedKeys.value = [pathMap[path] || '']
  },
  { immediate: true }
)
</script>

<style scoped>
.header-nav {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 24px;
}

.logo {
  display: flex;
  align-items: center;
  margin-right: 24px;
  cursor: pointer;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.nav-menu {
  flex: 1;
  border-bottom: none;
  line-height: 62px;
}

.nav-menu :deep(.ant-menu-item),
.nav-menu :deep(.ant-menu-submenu-title) {
  padding: 0 12px;
}

.nav-menu :deep(a) {
  color: inherit;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.language-select {
  width: 80px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.username {
  font-size: 14px;
  color: #333;
}
</style>
