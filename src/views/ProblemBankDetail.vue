<template>
  <div class="problem-bank-detail">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-area">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <router-link to="/problem-banks">题库管理</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ bankName }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="page-header">
      <h2>题目管理</h2>
      <div class="header-actions">
        <a-button @click="handleCreateOJ">创建OJ题</a-button>
        <a-button @click="handleCreateObjective">创建客观题</a-button>
        <a-button @click="handleBatchImport">批量复制</a-button>
      </div>
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

    <!-- 题目表格 -->
    <div class="table-area">
      <a-table
        :columns="columns"
        :data-source="filteredProblems"
        :pagination="{ pageSize: 15, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
        row-key="id"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'id'">
            <span>{{ record.id }}</span>
          </template>
          <template v-else-if="column.key === 'difficulty'">
            <a-tag :color="getDifficultyColor(record.difficulty)">{{ record.difficulty }}</a-tag>
          </template>
          <template v-else-if="column.key === 'tags'">
            <a-tag v-for="tag in record.tags" :key="tag" style="margin-right: 4px">{{ tag }}</a-tag>
          </template>
          <template v-else-if="column.key === 'permission'">
            <a-select
              :value="record.permission"
              style="width: 110px"
              size="small"
              @change="(value: string) => handlePermissionChange(record, value)"
            >
              <a-select-option value="公开题目">公开题目</a-select-option>
              <a-select-option value="私密题目">私密题目</a-select-option>
            </a-select>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="handleMove(record)">移动</a>
              <a-divider type="vertical" />
              <a @click="handleManageSolutions(record)">管理题解</a>
              <a-divider type="vertical" />
              <a @click="handleViewDetail(record)">查看</a>
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="handleDelete(record)" class="danger-link">删除</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 管理题目按钮 -->
    <div class="manage-btn-area">
      <a-button type="primary" @click="goBack">
        <template #icon><RollbackOutlined /></template>
        管理题目
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RollbackOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { mockProblemBanks } from '../mock/data'

interface BankProblem {
  id: string
  name: string
  owner: string
  difficulty: string
  tags: string[]
  createdAt: string
  permission: string
}

const route = useRoute()
const router = useRouter()

const bankId = ref(route.params.id as string)
const bankName = ref('核桃题库')
const searchKeyword = ref('')

// 模拟题库下的题目数据
const problems = ref<BankProblem[]>([
  { id: 'P1510C', name: '算法竞赛L21阶段测试客观题', owner: '董一班', difficulty: '普及/提高-', tags: [], createdAt: '2025-12-04 03:08:20', permission: '私密题目' },
  { id: 'P10781', name: 'L7-1 OJ题', owner: '胡意逸', difficulty: '入门', tags: [], createdAt: '2025-10-16 17:36:22', permission: '私密题目' },
  { id: 'P10568', name: 'BTY杯测题专用', owner: 'pcaspoas', difficulty: '入门', tags: [], createdAt: '2025-09-11 18:44:41', permission: '公开题目' },
  { id: 'P10791', name: 'L7-3 OJ题', owner: '袁国怡', difficulty: '入门', tags: [], createdAt: '2025-10-22 17:14:52', permission: '私密题目' },
  { id: 'P10809', name: 'L8-1 OJ题', owner: '冷毅', difficulty: '入门', tags: [], createdAt: '2025-10-28 15:32:40', permission: '私密题目' },
  { id: 'P1509C', name: 'L9-4 客观题【拔高】', owner: '陈文杰', difficulty: '入门', tags: [], createdAt: '2025-12-02 16:55:52', permission: '私密题目' },
  { id: 'P1508C', name: 'L9-4 客观题', owner: '陈文杰', difficulty: '入门', tags: [], createdAt: '2025-12-02 16:38:39', permission: '私密题目' },
  { id: 'P1506C', name: 'L9-3 客观题', owner: '冷毅', difficulty: '入门', tags: [], createdAt: '2025-12-02 11:44:43', permission: '私密题目' },
  { id: 'P1507C', name: 'L9-3 客观题【拔高】', owner: '冷毅', difficulty: '入门', tags: [], createdAt: '2025-12-02 14:59:12', permission: '私密题目' },
  { id: 'P10812', name: 'L8-2 OJ题', owner: '陈文杰', difficulty: '入门', tags: [], createdAt: '2025-10-28 16:21:00', permission: '私密题目' },
  { id: 'P10884', name: 'L9-2 OJ题', owner: '方蓝茵', difficulty: '入门', tags: [], createdAt: '2025-11-14 16:14:12', permission: '私密题目' },
  { id: 'P10946', name: 'L8-3 OJ题1【拔高】', owner: '王朔', difficulty: '入门', tags: [], createdAt: '2025-11-28 21:18:33', permission: '私密题目' },
  { id: 'P1505C', name: 'L9-1 客观题【拔高】', owner: '谭齐', difficulty: '入门', tags: [], createdAt: '2025-11-30 15:34:59', permission: '私密题目' },
  { id: 'P10972', name: 'L9-1 OJ题2【拔高】', owner: '谭齐', difficulty: '入门', tags: [], createdAt: '2025-11-30 15:50:21', permission: '私密题目' },
  { id: 'P10971', name: 'L9-1 OJ题1【拔高】', owner: '谭齐', difficulty: '入门', tags: [], createdAt: '2025-11-30 15:46:13', permission: '私密题目' },
])

// 表格列定义
const columns = [
  { title: '题目编号', dataIndex: 'id', key: 'id', width: 100 },
  { title: '名称', dataIndex: 'name', key: 'name', width: 200 },
  { title: '题目所有者', dataIndex: 'owner', key: 'owner', width: 100 },
  { title: '难度', dataIndex: 'difficulty', key: 'difficulty', width: 100 },
  { title: '题目标签', dataIndex: 'tags', key: 'tags', width: 150 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  { title: '权限', dataIndex: 'permission', key: 'permission', width: 100 },
  { title: '操作', key: 'action', width: 280, fixed: 'right' as const },
]

// 过滤后的题目列表
const filteredProblems = computed(() => {
  if (!searchKeyword.value) return problems.value
  const keyword = searchKeyword.value.toLowerCase()
  return problems.value.filter(p => 
    p.id.toLowerCase().includes(keyword) || 
    p.name.toLowerCase().includes(keyword) ||
    p.owner.toLowerCase().includes(keyword)
  )
})

// 获取难度颜色
const getDifficultyColor = (difficulty: string) => {
  const colorMap: Record<string, string> = {
    '入门': 'green',
    '普及': 'blue',
    '普及/提高-': 'orange',
    '提高': 'orange',
    '提高/省选-': 'red',
    '省选': 'purple',
  }
  return colorMap[difficulty] || 'default'
}

// 初始化
onMounted(() => {
  const bank = mockProblemBanks.find(b => b.id === bankId.value)
  if (bank) {
    bankName.value = bank.name
  }
})

// 搜索
const handleSearch = () => {
  message.info('搜索题目（原型展示）')
}

// 创建OJ题
const handleCreateOJ = () => {
  router.push({ name: 'CreateProblem', params: { id: bankId.value } })
}

// 创建客观题
const handleCreateObjective = () => {
  router.push({ name: 'CreateObjectiveProblem', params: { id: bankId.value } })
}

// 批量复制
const handleBatchImport = () => {
  message.info('批量复制（原型展示）')
}

// 移动题目
const handleMove = (record: BankProblem) => {
  message.info(`移动题目: ${record.name}（原型展示）`)
}

// 管理题解
const handleManageSolutions = (record: BankProblem) => {
  message.info(`管理题解: ${record.name}（原型展示）`)
}

// 查看详情
const handleViewDetail = (record: BankProblem) => {
  message.info(`查看题目: ${record.name}（原型展示）`)
}

// 编辑题目
const handleEdit = (record: BankProblem) => {
  message.info(`编辑题目: ${record.name}（原型展示）`)
}

// 删除题目
const handleDelete = (record: BankProblem) => {
  message.warning(`删除题目: ${record.name}（原型展示）`)
}

// 权限变更
const handlePermissionChange = (record: BankProblem, value: string) => {
  record.permission = value
  message.success(`已将 ${record.name} 权限修改为 ${value}`)
}

// 返回题库管理
const goBack = () => {
  router.push('/problem-banks')
}
</script>

<style scoped>
.problem-bank-detail {
  padding: 24px;
}

.breadcrumb-area {
  margin-bottom: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.search-area {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.table-area {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.manage-btn-area {
  position: fixed;
  top: 60px;
  right: 24px;
}

.danger-link {
  color: #ff4d4f;
}

.danger-link:hover {
  color: #ff7875;
}
</style>
