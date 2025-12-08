<template>
  <div class="problem-solution-management">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-area">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <router-link to="/problem-banks">题库</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ problemInfo }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="page-header">
      <h2>题解管理</h2>
      <a-button type="primary" @click="handleAddSolution">管理题解</a-button>
    </div>

    <!-- 题解表格 -->
    <div class="table-area">
      <a-table
        :columns="columns"
        :data-source="solutions"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'relatedProblem'">
            <a @click="handleViewProblem(record)">{{ relatedProblemName }}</a>
          </template>
          <template v-else-if="column.key === 'reportCount'">
            <span :class="record.reportCount > 0 ? 'text-warning' : ''">{{ record.reportCount }}</span>
          </template>
          <template v-else-if="column.key === 'status'">
            <span>{{ record.status }}</span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="handleManage(record)">管理</a>
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

interface ProblemSolution {
  id: string
  publisherId: string
  publisherNickname: string
  title: string
  relatedProblem: string
  likeCount: number
  commentCount: number
  reportCount: number
  submittedAt: string
  status: string
}

const route = useRoute()
const router = useRouter()

const bankId = ref(route.params.bankId as string)
const problemId = ref(route.params.problemId as string)
const problemInfo = ref('')
const relatedProblemName = ref('')

// 模拟题目名称映射
const problemNameMap: Record<string, string> = {
  P5315: '[GESP202412 一级] 温度转换',
  P1510C: '算法竞赛L21阶段测试客观题',
  P10781: 'L7-1 OJ题',
  P10568: 'BTY杯测题专用'
}

// 模拟题解数据（不包含relatedProblem，统一使用当前题目）
const solutions = ref<ProblemSolution[]>([
  {
    id: '50342',
    publisherId: '35942346',
    publisherNickname: '秦翊',
    title: 'P5315 [GESP202412 一级] 温度转换',
    relatedProblem: '',
    likeCount: 2,
    commentCount: 2,
    reportCount: 0,
    submittedAt: '2025-06-06 13:00:49',
    status: '公开'
  },
  {
    id: '50432',
    publisherId: '48873569',
    publisherNickname: 'dengjiaxin',
    title: '题解',
    relatedProblem: '',
    likeCount: 0,
    commentCount: 0,
    reportCount: 0,
    submittedAt: '2025-06-06 20:36:34',
    status: '公开'
  },
  {
    id: '57195',
    publisherId: '8504165',
    publisherNickname: '纯粹鼠鼠',
    title: 'P5315 [GESP202412 一级] 温度转换 题解',
    relatedProblem: '',
    likeCount: 1,
    commentCount: 1,
    reportCount: 0,
    submittedAt: '2025-06-23 10:55:47',
    status: '公开'
  },
  {
    id: '60687',
    publisherId: '4270633',
    publisherNickname: 'hetao4270633',
    title: '标题不能为空',
    relatedProblem: '',
    likeCount: 0,
    commentCount: 0,
    reportCount: 0,
    submittedAt: '2025-07-04 07:30:14',
    status: '公开'
  }
])

const columns = [
  { title: '题解ID', dataIndex: 'id', key: 'id', width: 100 },
  { title: '发布者ID', dataIndex: 'publisherId', key: 'publisherId', width: 100 },
  { title: '发布者昵称', dataIndex: 'publisherNickname', key: 'publisherNickname', width: 120 },
  { title: '标题', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
  { title: '关联题目', key: 'relatedProblem', width: 200, ellipsis: true },
  { title: '点赞数', dataIndex: 'likeCount', key: 'likeCount', width: 80 },
  { title: '评论数', dataIndex: 'commentCount', key: 'commentCount', width: 80 },
  { title: '被举报次数', key: 'reportCount', width: 100 },
  { title: '提交时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 160 },
  { title: '状态', key: 'status', width: 80 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const }
]

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 4,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
})

onMounted(() => {
  // 根据路由参数设置面包屑信息和关联题目名称
  const problemName = problemNameMap[problemId.value] || '未知题目'
  problemInfo.value = `[${problemId.value}] ${problemName}`
  relatedProblemName.value = `${problemId.value}${problemName}`
})

const handleAddSolution = () => {
  message.info('管理题解（原型展示）')
}

const handleViewProblem = (_record: ProblemSolution) => {
  message.info(`查看题目: ${relatedProblemName.value}（原型展示）`)
}

const handleManage = (record: ProblemSolution) => {
  message.info(`管理题解: ${record.id}（原型展示）`)
}

const handleDelete = (record: ProblemSolution) => {
  message.warning(`删除题解: ${record.id}（原型展示）`)
}
</script>

<style scoped>
.problem-solution-management {
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

.table-area {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.text-warning {
  color: #faad14;
}

.danger-link {
  color: #ff4d4f;
}

.danger-link:hover {
  color: #ff7875;
}
</style>
