<template>
  <div class="group-roles">
    <div class="roles-header">
      <h3>小组角色及权限管理</h3>
      <a-space>
        <a-button @click="handleEditPermissions">编辑角色权限</a-button>
        <a-button type="primary" @click="handleCreateRole">创建角色</a-button>
      </a-space>
    </div>

    <div class="roles-table">
      <a-table 
        :columns="columns" 
        :data-source="permissions" 
        :pagination="false" 
        row-key="key"
        :row-class-name="getRowClassName"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <span :class="{ 'section-title': record.isSection }">{{ record.name }}</span>
          </template>
          <template v-if="column.key === 'admin'">
            <a-checkbox v-if="!record.isSection" :checked="record.admin" disabled />
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const columns = [
  { title: '', dataIndex: 'name', key: 'name', width: 300 },
  { title: '管理员 ···', key: 'admin', width: 150, align: 'center' as const },
]

const permissions = ref([
  { key: 'section1', name: '题目管理', isSection: true },
  { key: 'p1', name: '小组题目管理-查看题目', admin: true },
  { key: 'p2', name: '小组题目管理-管理题目', admin: true },
  { key: 'section2', name: '成员管理', isSection: true },
  { key: 'p3', name: '小组成员管理-查看成员', admin: true },
  { key: 'p4', name: '小组成员管理-管理小组成员', admin: true },
  { key: 'section3', name: '题单管理', isSection: true },
  { key: 'p5', name: '小组题单管理-查看题单', admin: true },
  { key: 'p6', name: '小组题单管理-管理题单', admin: true },
  { key: 'section4', name: '全部提交', isSection: true },
  { key: 'p7', name: '小组全部提交-查看提交', admin: true },
  { key: 'section5', name: '比赛管理', isSection: true },
  { key: 'p8', name: '小组比赛管理-查看比赛', admin: true },
  { key: 'p9', name: '小组比赛管理-管理比赛', admin: true },
  { key: 'section6', name: '小组信息管理', isSection: true },
  { key: 'p10', name: '小组详情-查看详情', admin: true },
  { key: 'p11', name: '小组详情-编辑详情', admin: true },
  { key: 'p12', name: '小组公告管理-查看公告', admin: true },
  { key: 'p13', name: '小组公告管理-管理公告', admin: true },
])

const handleEditPermissions = () => {
  message.info('编辑角色权限（原型展示）')
}

const handleCreateRole = () => {
  message.info('创建角色（原型展示）')
}

const getRowClassName = (record: { isSection?: boolean }) => {
  return record.isSection ? 'section-row' : ''
}
</script>

<style scoped>
.group-roles {
  padding: 16px 0;
}

.roles-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.roles-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.roles-table {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.roles-table :deep(.section-row) {
  background-color: #fafafa;
}

.roles-table :deep(.section-row td) {
  background-color: #fafafa !important;
}

.section-title {
  font-weight: 600;
  color: #333;
}
</style>
