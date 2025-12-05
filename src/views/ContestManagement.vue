<template>
  <div class="contest-management">
    <div class="page-header">
      <h2>比赛管理</h2>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <a-form layout="inline">
        <a-form-item label="搜索">
          <a-input
            v-model:value="searchKeyword"
            placeholder="请输入比赛名称"
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
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-area">
      <a-button type="primary" @click="handleCreate">
        <template #icon><PlusOutlined /></template>
        创建比赛
      </a-button>
    </div>

    <!-- 比赛表格 -->
    <div class="table-area">
      <a-table
        :columns="columns"
        :data-source="filteredContests"
        :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
        row-key="id"
        :scroll="{ x: 1800 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleAllSubmissions(record)">全部提交</a>
              <a-divider type="vertical" />
              <a @click="handleManageProblems(record)">管理题目</a>
              <a-divider type="vertical" />
              <a @click="handleManageAnnouncements(record)">管理公告</a>
              <a-divider type="vertical" />
              <a @click="handleScoreboard(record)">成绩表</a>
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
import { SearchOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Contest } from '../types'
import { mockContests } from '../mock/data'

// 比赛列表数据
const contests = ref<Contest[]>([...mockContests])

// 搜索条件
const searchKeyword = ref('')

// 表格列定义
const columns = [
  {
    title: '比赛名称',
    dataIndex: 'name',
    key: 'name',
    width: 250,
  },
  {
    title: '所有者',
    dataIndex: 'owner',
    key: 'owner',
    width: 120,
  },
  {
    title: '比赛时长',
    dataIndex: 'duration',
    key: 'duration',
    width: 100,
  },
  {
    title: '赛制',
    dataIndex: 'format',
    key: 'format',
    width: 80,
  },
  {
    title: '题目数',
    dataIndex: 'problemCount',
    key: 'problemCount',
    width: 80,
  },
  {
    title: '比赛状态',
    key: 'status',
    width: 100,
  },
  {
    title: '报名人数',
    dataIndex: 'registeredCount',
    key: 'registeredCount',
    width: 100,
  },
  {
    title: '提交人数',
    dataIndex: 'submittedCount',
    key: 'submittedCount',
    width: 100,
  },
  {
    title: '补题人数',
    dataIndex: 'reviewCount',
    key: 'reviewCount',
    width: 100,
  },
  {
    title: '最近修改人',
    dataIndex: 'lastModifiedBy',
    key: 'lastModifiedBy',
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
    width: 400,
    fixed: 'right' as const,
  },
]

// 过滤后的比赛列表
const filteredContests = computed(() => {
  if (!searchKeyword.value.trim()) {
    return contests.value
  }
  return contests.value.filter(contest =>
    contest.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 获取状态颜色
const getStatusColor = (status: string) => {
  switch (status) {
    case '进行中':
      return 'green'
    case '已结束':
      return 'default'
    case '未开始':
      return 'blue'
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
  searchKeyword.value = ''
}

// 创建比赛
const handleCreate = () => {
  message.info('创建比赛（原型展示）')
}

// 全部提交
const handleAllSubmissions = (contest: Contest) => {
  message.info(`查看全部提交: ${contest.name}（原型展示）`)
}

// 管理题目
const handleManageProblems = (contest: Contest) => {
  message.info(`管理题目: ${contest.name}（原型展示）`)
}

// 管理公告
const handleManageAnnouncements = (contest: Contest) => {
  message.info(`管理公告: ${contest.name}（原型展示）`)
}

// 成绩表
const handleScoreboard = (contest: Contest) => {
  message.info(`查看成绩表: ${contest.name}（原型展示）`)
}

// 查看比赛
const handleView = (contest: Contest) => {
  message.info(`查看比赛: ${contest.name}（原型展示）`)
}

// 编辑比赛
const handleEdit = (contest: Contest) => {
  message.info(`编辑比赛: ${contest.name}（原型展示）`)
}

// 删除比赛
const handleDelete = (contest: Contest) => {
  message.warning(`删除比赛: ${contest.name}（原型展示）`)
}
</script>

<style scoped>
.contest-management {
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

.action-area {
  margin-bottom: 16px;
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
