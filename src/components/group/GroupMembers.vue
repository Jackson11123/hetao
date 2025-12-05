<template>
  <div class="group-members">
    <div class="members-header">
      <h3>小组成员管理</h3>
      <a-button type="primary" @click="handleImportUsers">导入用户</a-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="请输入搜索关键字"
        style="width: 200px"
        @search="handleSearch"
      />
      <a-button type="primary" @click="handleSearch">搜索</a-button>
    </div>

    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="members"
      :pagination="{ pageSize: 20, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
      row-key="userId"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'realName'">
          <span>{{ record.realName || '-' }}</span>
        </template>
        <template v-if="column.key === 'role'">
          <a-tag :color="getRoleColor(record.role)">{{ record.role }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="handleEditRole(record)">编辑角色</a>
            <a-divider type="vertical" />
            <a @click="handleRemove(record)" class="danger-link">移除</a>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'

interface Member {
  userId: string
  nickname: string
  realName: string
  role: string
  createdAt: string
}

const searchKeyword = ref('')

const members = ref<Member[]>([
  { userId: '53034302', nickname: '王星705', realName: '王星', role: '小组所有者', createdAt: '2025-12-03 23:37:19' },
  { userId: '59780705', nickname: 'teacher_lu', realName: '陆老师', role: '管理员', createdAt: '2025-12-03 23:38:10' },
  { userId: '60493132', nickname: 'hetao60493132', realName: '', role: '管理员', createdAt: '2025-12-05 10:36:41' },
  { userId: '60493555', nickname: 'hetao60493555', realName: '', role: '管理员', createdAt: '2025-12-05 10:56:20' },
  { userId: '26328394', nickname: 'hetao26328394', realName: '陈宇夏', role: '', createdAt: '2025-12-04 21:31:25' },
  { userId: '60494721', nickname: '黄宸清', realName: '黄宸清', role: '', createdAt: '2025-12-05 12:03:08' },
  { userId: '60495867', nickname: 'hetao60495867', realName: '张瀚文', role: '', createdAt: '2025-12-05 13:06:13' },
  { userId: '60495967', nickname: 'hetao60495967', realName: '', role: '', createdAt: '2025-12-05 13:12:51' },
  { userId: '60495344', nickname: '蒋宇宸', realName: '', role: '', createdAt: '2025-12-05 13:16:43' },
  { userId: '60496588', nickname: 'liushuoran', realName: '刘卓然', role: '', createdAt: '2025-12-05 13:54:19' },
])

const columns = [
  { title: '用户ID', dataIndex: 'userId', key: 'userId', width: 120 },
  { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 150 },
  { title: '真实姓名', key: 'realName', width: 120 },
  { title: '角色', key: 'role', width: 120 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  { title: '操作', key: 'action', width: 150 },
]

const getRoleColor = (role: string) => {
  if (role === '小组所有者') return 'purple'
  if (role === '管理员') return 'blue'
  return 'default'
}

const handleSearch = () => {
  message.info('搜索成员（原型展示）')
}

const handleImportUsers = () => {
  message.info('导入用户（原型展示）')
}

const handleEditRole = (record: Member) => {
  message.info(`编辑角色: ${record.nickname}（原型展示）`)
}

const handleRemove = (record: Member) => {
  message.warning(`移除成员: ${record.nickname}（原型展示）`)
}
</script>

<style scoped>
.group-members {
  padding: 16px 0;
}

.members-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.members-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.search-area {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.danger-link {
  color: #ff4d4f;
}
</style>
