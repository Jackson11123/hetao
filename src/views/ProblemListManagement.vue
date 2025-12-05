<template>
  <div class="problem-list-management">
    <div class="page-header">
      <h2>题单管理</h2>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <a-form layout="inline">
        <a-form-item label="搜索">
          <a-input
            v-model:value="searchKeyword"
            placeholder="请输入题单标题"
            allow-clear
            style="width: 300px"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button style="margin-left: 8px" @click="handleReset">
            重置
          </a-button>
        </a-form-item>
      </a-form>
      <a-button type="primary" @click="handleCreate">
        <template #icon><PlusOutlined /></template>
        创建题单
      </a-button>
    </div>

    <!-- 题单表格 -->
    <div class="table-area">
      <a-table
        :columns="columns"
        :data-source="filteredProblemLists"
        :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
        row-key="id"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'permission'">
            <span>{{ record.permission === '公开' ? '公开' : '私密' }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space :wrap="false">
              <a @click="handleManageProblems(record)">管理题目</a>
              <a-divider type="vertical" />
              <a @click="handleCompletionStatus(record)">完成情况</a>
              <a-divider type="vertical" />
              <a @click="handleView(record)">查看</a>
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="handleDelete(record)" class="danger-link">删除</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { ProblemList } from '../types'
import { mockProblemLists } from '../mock/data'

const router = useRouter()

// 题单列表数据
const problemLists = ref<ProblemList[]>([...mockProblemLists])

// 搜索条件
const searchKeyword = ref('')

// 表格列定义
const columns = [
  {
    title: '题单编号',
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    width: 180,
  },
  {
    title: '副标题',
    dataIndex: 'subtitle',
    key: 'subtitle',
    width: 200,
  },
  {
    title: '所有者',
    dataIndex: 'owner',
    key: 'owner',
    width: 120,
  },
  {
    title: '题目数',
    dataIndex: 'problemCount',
    key: 'problemCount',
    width: 80,
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
    width: 80,
  },
  {
    title: '操作',
    key: 'action',
    width: 340,
    fixed: 'right' as const,
  },
]

// 过滤后的题单列表
const filteredProblemLists = computed(() => {
  if (!searchKeyword.value.trim()) {
    return problemLists.value
  }
  return problemLists.value.filter(problemList =>
    problemList.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 搜索处理
const handleSearch = () => {
  message.info('搜索完成')
}

// 重置搜索条件
const handleReset = () => {
  searchKeyword.value = ''
}

// 创建题单
const handleCreate = () => {
  router.push({ name: 'CreateProblemList' })
}

// 管理题目
const handleManageProblems = (problemList: ProblemList) => {
  message.info(`管理题目: ${problemList.title}（原型展示）`)
}

// 完成情况
const handleCompletionStatus = (problemList: ProblemList) => {
  message.info(`查看完成情况: ${problemList.title}（原型展示）`)
}

// 查看题单
const handleView = (problemList: ProblemList) => {
  message.info(`查看题单: ${problemList.title}（原型展示）`)
}

// 编辑题单
const handleEdit = (problemList: ProblemList) => {
  message.info(`编辑题单: ${problemList.title}（原型展示）`)
}

// 删除题单
const handleDelete = (problemList: ProblemList) => {
  message.warning(`删除题单: ${problemList.title}（原型展示）`)
}
</script>

<style scoped>
.problem-list-management {
  padding: 24px;
}

.page-header {
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
}

.search-area {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
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
</style>
