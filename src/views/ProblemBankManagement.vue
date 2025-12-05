<template>
  <div class="problem-bank-management">
    <div class="page-header">
      <h2>题库管理</h2>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-area">
      <div></div>
      <a-button type="primary" @click="handleCreate">
        <template #icon><PlusOutlined /></template>
        创建题库
      </a-button>
    </div>

    <!-- 题库表格 -->
    <div class="table-area">
      <a-table
        :columns="columns"
        :data-source="problemBanks"
        :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
        row-key="id"
        :scroll="{ x: 1000 }"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'permission'">
            <a-select
              :value="record.permission"
              style="width: 120px"
              @change="(value: 'public' | 'private') => handlePermissionChange(record, value)"
            >
              <a-select-option value="public">公开题库</a-select-option>
              <a-select-option value="private">私密题库</a-select-option>
            </a-select>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="handleManageProblems(record)">管理题目</a>
              <a-divider type="vertical" />
              <a @click="handleView(record)">查看</a>
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="handleDelete(record)" class="danger-link">删除</a>
              <a-divider type="vertical" />
              <a @click="handleMoveUp(index)" :class="{ 'disabled-link': index === 0 }">上移</a>
              <a-divider type="vertical" />
              <a @click="handleMoveDown(index)" :class="{ 'disabled-link': index === problemBanks.length - 1 }">下移</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { ProblemBank } from '../types'
import { mockProblemBanks } from '../mock/data'

const router = useRouter()

// 题库列表数据
const problemBanks = ref<ProblemBank[]>([...mockProblemBanks])

// 表格列定义
const columns = [
  {
    title: '题库名',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 120,
  },
  {
    title: '最近修改人',
    dataIndex: 'lastModifiedBy',
    key: 'lastModifiedBy',
    width: 120,
  },
  {
    title: '权限',
    key: 'permission',
    width: 140,
  },
  {
    title: '操作',
    key: 'action',
    width: 320,
    fixed: 'right' as const,
  },
]

// 创建题库
const handleCreate = () => {
  message.info('创建题库（原型展示）')
}

// 权限变更
const handlePermissionChange = (record: ProblemBank, value: 'public' | 'private') => {
  record.permission = value
  const permissionText = value === 'public' ? '公开题库' : '私密题库'
  message.success(`已将 ${record.name} 权限修改为 ${permissionText}`)
}

// 管理题目
const handleManageProblems = (record: ProblemBank) => {
  router.push(`/problem-banks/${record.id}`)
}

// 查看题库
const handleView = (record: ProblemBank) => {
  message.info(`查看题库: ${record.name}（原型展示）`)
}

// 编辑题库
const handleEdit = (record: ProblemBank) => {
  message.info(`编辑题库: ${record.name}（原型展示）`)
}

// 删除题库
const handleDelete = (record: ProblemBank) => {
  message.warning(`删除题库: ${record.name}（原型展示）`)
}

// 上移题库
const handleMoveUp = (index: number) => {
  if (index === 0) return
  const temp = problemBanks.value[index]
  problemBanks.value[index] = problemBanks.value[index - 1]
  problemBanks.value[index - 1] = temp
  message.success('上移成功')
}

// 下移题库
const handleMoveDown = (index: number) => {
  if (index === problemBanks.value.length - 1) return
  const temp = problemBanks.value[index]
  problemBanks.value[index] = problemBanks.value[index + 1]
  problemBanks.value[index + 1] = temp
  message.success('下移成功')
}
</script>

<style scoped>
.problem-bank-management {
  padding: 24px;
}

.page-header {
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
}

.action-area {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-area {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.danger-link {
  color: #ff4d4f;
}

.danger-link:hover {
  color: #ff7875;
}

.disabled-link {
  color: #d9d9d9;
  cursor: not-allowed;
}

.disabled-link:hover {
  color: #d9d9d9;
}
</style>
