<template>
  <div class="home">
    <a-row :gutter="[24, 24]">
      <!-- 快速入口卡片 -->
      <a-col :span="8">
        <a-card title="快速入口" class="home-card">
          <div class="quick-links">
            <router-link to="/submissions" class="quick-link">
              <a-button type="link">全部提交</a-button>
            </router-link>
            <router-link to="/content" class="quick-link">
              <a-button type="link">内容管理</a-button>
            </router-link>
            <router-link to="/problem-banks" class="quick-link">
              <a-button type="link">题库管理</a-button>
            </router-link>
            <router-link to="/problem-lists" class="quick-link">
              <a-button type="link">题单管理</a-button>
            </router-link>
            <router-link to="/contests" class="quick-link">
              <a-button type="link">比赛管理</a-button>
            </router-link>
            <router-link to="/groups" class="quick-link">
              <a-button type="link">小组管理</a-button>
            </router-link>
            <router-link to="/users" class="quick-link">
              <a-button type="link">用户管理</a-button>
            </router-link>
            <router-link to="/tags" class="quick-link">
              <a-button type="link">标签管理</a-button>
            </router-link>
          </div>
        </a-card>
      </a-col>

      <!-- 快速创建卡片 -->
      <a-col :span="8">
        <a-card title="快速创建" class="home-card">
          <div class="quick-links">
            <a class="quick-link">
              <a-button type="link">创建题库</a-button>
            </a>
            <a class="quick-link">
              <a-button type="link">创建题单</a-button>
            </a>
            <a class="quick-link">
              <a-button type="link">创建比赛</a-button>
            </a>
            <a class="quick-link">
              <a-button type="link">创建小组</a-button>
            </a>
          </div>
        </a-card>
      </a-col>

      <!-- 首页配置卡片 -->
      <a-col :span="8">
        <a-card title="首页配置" class="home-card">
          <div class="quick-links">
            <a class="quick-link">
              <a-button type="link">核桃精选</a-button>
            </a>
            <a class="quick-link">
              <a-button type="link">首页Banner</a-button>
            </a>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  padding: 24px;
}

.home-card {
  height: 100%;
}

.home-card :deep(.ant-card-head-title) {
  font-weight: 600;
}

.quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-link {
  display: inline-block;
}

.quick-link :deep(.ant-btn-link) {
  padding: 4px 8px;
  height: auto;
}
</style>
