<template>
  <div class="content-management">
    <div class="page-header">
      <h2>内容管理</h2>
    </div>

    <!-- 子导航标签 -->
    <div class="sub-nav">
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="problemComment" tab="题目评论管理" />
        <a-tab-pane key="solution" tab="题解管理" />
        <a-tab-pane key="solutionComment" tab="题解评论管理" />
        <a-tab-pane key="discussion" tab="讨论管理" />
        <a-tab-pane key="discussionComment" tab="讨论评论管理" />
        <a-tab-pane key="postApplication" tab="发帖申请表" />
      </a-tabs>
    </div>

    <!-- 题解管理内容（当前仅实现题解管理标签页） -->
    <template v-if="activeTab === 'solution'">
      <!-- 搜索区域 -->
      <div class="search-area">
        <a-form layout="inline">
          <a-form-item label="题解ID">
            <a-input
              v-model:value="searchSolutionId"
              placeholder="请输入题解ID"
              allow-clear
              style="width: 150px"
            />
          </a-form-item>
          <a-form-item label="关键字">
            <a-input
              v-model:value="searchKeyword"
              placeholder="请输入关键字"
              allow-clear
              style="width: 150px"
            />
          </a-form-item>
          <a-form-item label="审核状态">
            <a-select
              v-model:value="searchStatus"
              placeholder="请选择状态"
              allow-clear
              style="width: 120px"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="已通过">已通过</a-select-option>
              <a-select-option value="待审核">待审核</a-select-option>
              <a-select-option value="已拒绝">已拒绝</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="时间范围">
            <a-range-picker
              v-model:value="searchDateRange"
              style="width: 240px"
            />
          </a-form-item>
          <a-form-item label="操作人">
            <a-input
              v-model:value="searchOperator"
              placeholder="请输入操作人"
              allow-clear
              style="width: 150px"
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
      </div>

      <!-- 题解表格 -->
      <div class="table-area">
        <a-table
          :columns="solutionColumns"
          :data-source="filteredSolutions"
          :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
          row-key="id"
          :scroll="{ x: 1400 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <a @click="handleManage(record)">管理</a>
            </template>
          </template>
        </a-table>
      </div>
    </template>

    <!-- 其他标签页占位内容 -->
    <template v-else>
      <div class="placeholder-content">
        <a-empty description="该功能模块开发中..." />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import type { Solution } from '../types'
import { mockSolutions } from '../mock/data'

// 当前激活的标签页
const activeTab = ref('solution')

// 题解列表数据
const solutions = ref<Solution[]>([...mockSolutions])

// 搜索条件
const searchSolutionId = ref('')
const searchKeyword = ref('')
const searchStatus = ref('')
const searchDateRange = ref<[Dayjs, Dayjs] | null>(null)
const searchOperator = ref('')

// 题解表格列定义
const solutionColumns = [
  {
    title: '题解ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '发布者ID',
    dataIndex: 'publisherId',
    key: 'publisherId',
    width: 100,
  },
  {
    title: '发布者昵称',
    dataIndex: 'publisherNickname',
    key: 'publisherNickname',
    width: 120,
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    width: 200,
    ellipsis: true,
  },
  {
    title: '关联题目',
    dataIndex: 'relatedProblem',
    key: 'relatedProblem',
    width: 100,
  },
  {
    title: '点赞数',
    dataIndex: 'likeCount',
    key: 'likeCount',
    width: 80,
  },
  {
    title: '评论数',
    dataIndex: 'commentCount',
    key: 'commentCount',
    width: 80,
  },
  {
    title: '被举报次数',
    dataIndex: 'reportCount',
    key: 'reportCount',
    width: 100,
  },
  {
    title: '提交时间',
    dataIndex: 'submittedAt',
    key: 'submittedAt',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '最后操作人',
    dataIndex: 'lastOperator',
    key: 'lastOperator',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    fixed: 'right' as const,
  },
]


// 过滤后的题解列表
const filteredSolutions = computed(() => {
  return solutions.value.filter(solution => {
    const matchId = !searchSolutionId.value.trim() || 
      solution.id.toLowerCase().includes(searchSolutionId.value.toLowerCase())
    const matchKeyword = !searchKeyword.value.trim() || 
      solution.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchStatus = !searchStatus.value || 
      solution.status === searchStatus.value
    const matchOperator = !searchOperator.value.trim() || 
      solution.lastOperator.toLowerCase().includes(searchOperator.value.toLowerCase())
    
    // 时间范围过滤
    let matchDate = true
    if (searchDateRange.value && searchDateRange.value[0] && searchDateRange.value[1]) {
      const submittedDate = new Date(solution.submittedAt)
      const startDate = searchDateRange.value[0].toDate()
      const endDate = searchDateRange.value[1].toDate()
      matchDate = submittedDate >= startDate && submittedDate <= endDate
    }
    
    return matchId && matchKeyword && matchStatus && matchOperator && matchDate
  })
})

// 获取状态颜色
const getStatusColor = (status: string) => {
  switch (status) {
    case '已通过':
      return 'green'
    case '待审核':
      return 'orange'
    case '已拒绝':
      return 'red'
    default:
      return 'default'
  }
}

// 搜索处理
const handleSearch = () => {
  message.info('搜索完成')
}

// 重置搜索条件
const handleReset = () => {
  searchSolutionId.value = ''
  searchKeyword.value = ''
  searchStatus.value = ''
  searchDateRange.value = null
  searchOperator.value = ''
}

// 管理操作
const handleManage = (solution: Solution) => {
  message.info(`管理题解: ${solution.title}（原型展示）`)
}
</script>

<style scoped>
.content-management {
  padding: 24px;
}

.page-header {
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
}

.sub-nav {
  margin-bottom: 16px;
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

.placeholder-content {
  padding: 48px;
  background: #fafafa;
  border-radius: 4px;
  text-align: center;
}
</style>
