<template>
  <div class="group-detail">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-area">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <router-link to="/groups">小组管理</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ groupInfo.name }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <!-- 二级Tabs -->
    <a-tabs v-model:activeKey="activeTab" class="group-tabs">
      <a-tab-pane key="submissions" tab="小组全部提交">
        <GroupSubmissions />
      </a-tab-pane>
      <a-tab-pane key="info" tab="小组信息">
        <GroupInfo :group="groupInfo" @update="handleUpdateGroup" />
      </a-tab-pane>
      <a-tab-pane key="roles" tab="角色与权限">
        <GroupRoles />
      </a-tab-pane>
      <a-tab-pane key="applications" tab="加组申请">
        <GroupApplications />
      </a-tab-pane>
      <a-tab-pane key="members" tab="管理成员">
        <GroupMembers />
      </a-tab-pane>
      <a-tab-pane key="problems" tab="管理题目">
        <GroupProblems />
      </a-tab-pane>
      <a-tab-pane key="problemLists" tab="管理题单">
        <GroupProblemLists />
      </a-tab-pane>
      <a-tab-pane key="contests" tab="管理比赛">
        <GroupContests />
      </a-tab-pane>
      <a-tab-pane key="announcements" tab="管理公告">
        <GroupAnnouncements />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import { mockGroups } from '../mock/data'
import GroupSubmissions from '../components/group/GroupSubmissions.vue'
import GroupInfo from '../components/group/GroupInfo.vue'
import GroupRoles from '../components/group/GroupRoles.vue'
import GroupApplications from '../components/group/GroupApplications.vue'
import GroupMembers from '../components/group/GroupMembers.vue'
import GroupProblems from '../components/group/GroupProblems.vue'
import GroupProblemLists from '../components/group/GroupProblemLists.vue'
import GroupContests from '../components/group/GroupContests.vue'
import GroupAnnouncements from '../components/group/GroupAnnouncements.vue'

const route = useRoute()
const activeTab = ref('submissions')
const groupId = route.params.id as string

// 提供groupId给子组件
provide('groupId', groupId)

const groupInfo = reactive({
  id: '',
  name: '',
  description: '',
  type: '',
  permission: '',
  school: '',
  province: '',
  city: '',
  isTop300: false,
  schoolRank: '',
})

onMounted(() => {
  const group = mockGroups.find((g) => g.id === groupId)
  if (group) {
    groupInfo.id = group.id
    groupInfo.name = group.name
    groupInfo.type = group.type
    groupInfo.permission = group.permission
    groupInfo.school = group.school
    groupInfo.province = group.province
    groupInfo.description = group.name
    groupInfo.isTop300 = group.isTop300
  }
})

const handleUpdateGroup = (data: typeof groupInfo) => {
  Object.assign(groupInfo, data)
}
</script>

<style scoped>
.group-detail {
  padding: 16px 24px;
  background: #fff;
  min-height: calc(100vh - 64px);
}

.breadcrumb-area {
  margin-bottom: 16px;
}

.group-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 0;
}

.group-tabs :deep(.ant-tabs-tab) {
  padding: 12px 16px;
}
</style>
