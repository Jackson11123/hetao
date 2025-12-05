<template>
  <div class="problem-management">
    <div class="page-header">
      <h2>题目管理</h2>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <a-form layout="inline">
        <a-form-item label="题目编号">
          <a-input
            v-model:value="searchId"
            placeholder="请输入题目编号"
            allow-clear
            style="width: 150px"
          />
        </a-form-item>
        <a-form-item label="题目名称">
          <a-input
            v-model:value="searchName"
            placeholder="请输入题目名称"
            allow-clear
            style="width: 180px"
          />
        </a-form-item>
        <a-form-item label="所有者">
          <a-input
            v-model:value="searchOwner"
            placeholder="请输入所有者"
            allow-clear
            style="width: 150px"
          />
        </a-form-item>
        <a-form-item label="难度">
          <a-select
            v-model:value="searchDifficulty"
            placeholder="请选择难度"
            allow-clear
            style="width: 120px"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="diff in difficulties" :key="diff" :value="diff">
              {{ diff }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标签">
          <a-select
            v-model:value="searchTag"
            placeholder="请选择标签"
            allow-clear
            style="width: 150px"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="tag in availableTags" :key="tag" :value="tag">
              {{ tag }}
            </a-select-option>
          </a-select>
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
    </div>

    <!-- 题目表格 -->
    <div class="table-area">
      <a-table
        :columns="columns"
        :data-source="filteredProblems"
        :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
        row-key="id"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'difficulty'">
            <a-tag :color="getDifficultyColor(record.difficulty)">
              {{ record.difficulty }}
            </a-tag>
          </template>
          <template v-if="column.key === 'tags'">
            <a-tag v-for="tag in record.tags" :key="tag" style="margin-right: 4px">
              {{ tag }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a @click="handleViewSource(record)">查看来源</a>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Problem } from '../types'
import { mockProblems, mockTags } from '../mock/data'

// 题目列表数据
const problems = ref<Problem[]>([...mockProblems])

// 搜索条件
const searchId = ref('')
const searchName = ref('')
const searchOwner = ref('')
const searchDifficulty = ref('')
const searchTag = ref('')

// 难度列表
const difficulties = ['入门', '普及', '提高', '省选', 'NOI']

// 可用标签列表
const availableTags = computed(() => mockTags.map(tag => tag.name))

// 表格列定义
const columns = [
  {
    title: '题目编号',
    dataIndex: 'id',
    key: 'id',
    width: 120,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '所有者',
    dataIndex: 'owner',
    key: 'owner',
    width: 120,
  },
  {
    title: '难度',
    key: 'difficulty',
    width: 100,
  },
  {
    title: '题目标签',
    key: 'tags',
    width: 200,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 120,
  },
  {
    title: '权限',
    dataIndex: 'permission',
    key: 'permission',
    width: 80,
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    fixed: 'right' as const,
  },
]

// 过滤后的题目列表
const filteredProblems = computed(() => {
  return problems.value.filter(problem => {
    const matchId = !searchId.value.trim() || 
      problem.id.toLowerCase().includes(searchId.value.toLowerCase())
    const matchName = !searchName.value.trim() || 
      problem.name.toLowerCase().includes(searchName.value.toLowerCase())
    const matchOwner = !searchOwner.value.trim() || 
      problem.owner.toLowerCase().includes(searchOwner.value.toLowerCase())
    const matchDifficulty = !searchDifficulty.value || 
      problem.difficulty === searchDifficulty.value
    const matchTag = !searchTag.value || 
      problem.tags.includes(searchTag.value)
    return matchId && matchName && matchOwner && matchDifficulty && matchTag
  })
})

// 获取难度对应的颜色
const getDifficultyColor = (difficulty: string): string => {
  const colorMap: Record<string, string> = {
    '入门': 'green',
    '普及': 'blue',
    '提高': 'orange',
    '省选': 'red',
    'NOI': 'purple',
  }
  return colorMap[difficulty] || 'default'
}

// 搜索处理
const handleSearch = () => {
  message.info('搜索完成')
}

// 重置搜索条件
const handleReset = () => {
  searchId.value = ''
  searchName.value = ''
  searchOwner.value = ''
  searchDifficulty.value = ''
  searchTag.value = ''
}

// 查看来源
const handleViewSource = (problem: Problem) => {
  message.info(`查看题目来源: ${problem.name}（原型展示）`)
}
</script>

<style scoped>
.problem-management {
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
}

.table-area {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}
</style>
