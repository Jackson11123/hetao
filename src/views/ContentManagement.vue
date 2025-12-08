<template>
  <div class="content-management">
    <!-- 子导航标签 -->
    <div class="sub-nav">
      <div class="sub-nav-right">
        <a-radio-group v-model:value="activeTab" button-style="solid">
          <a-radio-button value="problemComment">题目评论管理</a-radio-button>
          <a-radio-button value="solution">题解管理</a-radio-button>
          <a-radio-button value="solutionComment">题解评论管理</a-radio-button>
          <a-radio-button value="discussion">讨论管理</a-radio-button>
          <a-radio-button value="discussionComment">讨论评论管理</a-radio-button>
          <a-radio-button value="postApplication">发帖申请表</a-radio-button>
        </a-radio-group>
      </div>
    </div>

    <!-- 根据选中的标签显示对应组件 -->
    <ProblemCommentManagement v-if="activeTab === 'problemComment'" />
    <SolutionManagement v-else-if="activeTab === 'solution'" />
    <SolutionCommentManagement v-else-if="activeTab === 'solutionComment'" />
    <DiscussionManagement v-else-if="activeTab === 'discussion'" />
    <DiscussionCommentManagement v-else-if="activeTab === 'discussionComment'" />
    <PostApplicationManagement v-else-if="activeTab === 'postApplication'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProblemCommentManagement from '../components/content/ProblemCommentManagement.vue'
import SolutionManagement from '../components/content/SolutionManagement.vue'
import SolutionCommentManagement from '../components/content/SolutionCommentManagement.vue'
import DiscussionManagement from '../components/content/DiscussionManagement.vue'
import DiscussionCommentManagement from '../components/content/DiscussionCommentManagement.vue'
import PostApplicationManagement from '../components/content/PostApplicationManagement.vue'

const activeTab = ref('problemComment')
</script>

<style scoped>
.content-management {
  padding: 24px;
}

.sub-nav {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
