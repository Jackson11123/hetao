<template>
  <div class="group-applications">
    <div class="applications-header">
      <h3>加组申请管理</h3>
      <a-button type="link" @click="handleViewHistory">审核历史</a-button>
    </div>

    <!-- 批量操作 -->
    <div class="batch-actions">
      <a-button type="primary" danger size="small" @click="handleBatchReject">批量拒绝</a-button>
      <a-button type="primary" size="small" @click="handleBatchApprove">批量通过申请</a-button>
    </div>

    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="applications"
      :pagination="{ pageSize: 20, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
      row-key="id"
      :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'avatar'">
          <a-avatar :size="32">{{ record.nickname?.charAt(0) }}</a-avatar>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="handleApprove(record)" class="success-link">通过</a>
            <a-divider type="vertical" />
            <a @click="handleReject(record)" class="danger-link">拒绝</a>
          </a-space>
        </template>
      </template>
      <template #emptyText>
        <a-empty description="暂无数据" />
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'

interface Application {
  id: string
  avatar: string
  userId: string
  nickname: string
  realName: string
  reason: string
  applyTime: string
}

const selectedRowKeys = ref<string[]>([])
const applications = ref<Application[]>([])

const columns = [
  { title: '用户头像', key: 'avatar', width: 80 },
  { title: '用户ID', dataIndex: 'userId', key: 'userId', width: 120 },
  { title: '用户昵称', dataIndex: 'nickname', key: 'nickname', width: 120 },
  { title: '用户签名', dataIndex: 'realName', key: 'realName', width: 120 },
  { title: '申请理由', dataIndex: 'reason', key: 'reason', width: 200 },
  { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: 180 },
  { title: '操作', key: 'action', width: 120 },
]

const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

const handleViewHistory = () => {
  message.info('查看审核历史（原型展示）')
}

const handleBatchReject = () => {
  message.info('批量拒绝（原型展示）')
}

const handleBatchApprove = () => {
  message.info('批量通过申请（原型展示）')
}

const handleApprove = (record: Application) => {
  message.success(`已通过 ${record.nickname} 的申请（原型展示）`)
}

const handleReject = (record: Application) => {
  message.warning(`已拒绝 ${record.nickname} 的申请（原型展示）`)
}
</script>

<style scoped>
.group-applications {
  padding: 16px 0;
}

.applications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.applications-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.batch-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.success-link {
  color: #52c41a;
}

.danger-link {
  color: #ff4d4f;
}
</style>
