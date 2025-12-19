<template>
  <div class="group-contest-detail">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-area">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/groups">小组管理</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link :to="`/groups/${groupId}`">{{ groupName }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ contestName }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="header-tabs">
        <a-button :type="activeTab === 'problems' ? 'primary' : 'default'" @click="activeTab = 'problems'">管理题目</a-button>
        <a-button :type="activeTab === 'announcements' ? 'primary' : 'default'" @click="activeTab = 'announcements'">管理公告</a-button>
        <a-button :type="activeTab === 'scoreboard' ? 'primary' : 'default'" @click="activeTab = 'scoreboard'">成绩表</a-button>
        <a-button :type="activeTab === 'submissions' ? 'primary' : 'default'" @click="activeTab = 'submissions'">全部提交</a-button>
      </div>
    </div>

    <!-- 管理题目 -->
    <div v-if="activeTab === 'problems'" class="tab-content">
      <div class="page-header">
        <h2>比赛题目管理</h2>
        <div class="header-actions">
          <a @click="handleSearchReference">搜索引用</a>
          <a @click="handleBatchReference">批量引用</a>
        </div>
      </div>
      <div class="table-area">
        <a-table :columns="problemColumns" :data-source="problems" :pagination="false" row-key="id" size="small">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'tags'">
              <a-tag v-for="tag in record.tags" :key="tag" style="margin-right: 4px">{{ tag }}</a-tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="handleRemoveProblem(record)" class="danger-link">移除</a>
                <a-divider type="vertical" />
                <a @click="handleRejudge(record)">重测</a>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 管理公告 -->
    <div v-if="activeTab === 'announcements'" class="tab-content">
      <div class="page-header">
        <h2>比赛公告管理</h2>
        <a @click="handleCreateAnnouncement">创建比赛公告</a>
      </div>
      <div class="table-area">
        <a-table :columns="announcementColumns" :data-source="announcements" :pagination="announcementPagination" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'isTop'">
              <a-tag :color="record.isTop ? 'blue' : 'default'">{{ record.isTop ? '是' : '否' }}</a-tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="handleEditAnnouncement(record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="handleDeleteAnnouncement(record)" class="danger-link">删除</a>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 成绩表 -->
    <div v-if="activeTab === 'scoreboard'" class="tab-content">
      <div class="page-header">
        <h2>比赛成绩表</h2>
        <div class="header-actions">
          <a-button @click="handleDownloadRegistration"><DownloadOutlined />下载报名名单</a-button>
          <a-button type="primary" @click="handleDownloadScoreboard"><DownloadOutlined />下载实时成绩表</a-button>
        </div>
      </div>
      <div class="search-area">
        <a-input v-model:value="scoreboardSearch" placeholder="请输入搜索关键字" style="width: 200px" />
        <a-button type="primary" @click="handleSearchScoreboard">搜索</a-button>
      </div>
      <div class="table-area">
        <a-table :columns="scoreboardColumns" :data-source="scoreboardData" :pagination="scoreboardPagination" row-key="rank" :scroll="{ x: 1000 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key && column.key.startsWith('problem_')">
              <a v-if="record[column.key]" :class="getScoreClass(record[column.key])">{{ record[column.key] }}</a>
              <span v-else>-</span>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 全部提交 -->
    <div v-if="activeTab === 'submissions'" class="tab-content">
      <div class="page-header">
        <h2>比赛全部提交</h2>
        <div class="header-actions">
          <a-button @click="handleDownloadContestSubmissions"><DownloadOutlined />下载赛中提交</a-button>
          <a-button type="primary" @click="handleDownloadAfterSubmissions"><DownloadOutlined />下载赛后提交</a-button>
        </div>
      </div>
      <div class="search-area">
        <a-form layout="inline">
          <a-form-item label="用户ID"><a-input v-model:value="submissionSearch.userId" style="width: 100px" /></a-form-item>
          <a-form-item label="题目顺序"><a-select v-model:value="submissionSearch.problemOrder" style="width: 80px" allow-clear><a-select-option value="">全部</a-select-option></a-select></a-form-item>
          <a-form-item label="提交状态"><a-select v-model:value="submissionSearch.status" style="width: 80px" allow-clear><a-select-option value="">全部</a-select-option></a-select></a-form-item>
          <a-form-item><a-button type="primary" @click="handleSearchSubmissions">搜索</a-button></a-form-item>
        </a-form>
      </div>
      <div class="table-area">
        <a-table :columns="submissionColumns" :data-source="submissions" :pagination="submissionPagination" row-key="id" :scroll="{ x: 1400 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <span :class="getStatusClass(record.status)">{{ record.status }}</span>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 搜索引用弹窗 -->
    <a-modal v-model:open="searchReferenceVisible" title="搜索引用题目" width="700px" :footer="null">
      <a-input-search v-model:value="searchKeyword" placeholder="请输入关键词" @search="handleSearchProblems" style="margin-bottom: 16px" />
      <a-table :columns="searchColumns" :data-source="searchResults" :pagination="searchPagination" row-key="id" size="small">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a @click="handleAddProblem(record)">添加</a>
          </template>
        </template>
      </a-table>
    </a-modal>

    <!-- 批量引用弹窗 -->
    <a-modal v-model:open="batchReferenceVisible" title="批量引用题目" @ok="handleBatchReferenceOk">
      <a-input v-model:value="batchProblemIds" placeholder="请输入题目编号，逗号间隔" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { DownloadOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

const groupId = ref(route.params.id as string)
const contestId = ref(route.params.contestId as string)
const groupName = ref('测试小组')
const contestName = ref('C++算法设计大赛初赛模拟卷1')
const activeTab = ref((route.query.tab as string) || 'problems')

// 题目数据
const problems = ref([
  { id: 'P1511C', name: 'C++算法设计大赛模拟卷', difficulty: '入门', tags: [], createdAt: '2025-12-05 15:59:32' }
])
const problemColumns = [
  { title: '题目编号', dataIndex: 'id', key: 'id', width: 100 },
  { title: '名称', dataIndex: 'name', key: 'name', width: 200 },
  { title: '难度', dataIndex: 'difficulty', key: 'difficulty', width: 80 },
  { title: '题目标签', key: 'tags', width: 150 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
  { title: '操作', key: 'action', width: 120 }
]

// 公告数据
const announcements = ref<any[]>([])
const announcementColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '讨论标题', dataIndex: 'title', key: 'title', width: 200 },
  { title: '发表者', dataIndex: 'author', key: 'author', width: 100 },
  { title: '发表时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
  { title: '置顶', key: 'isTop', width: 80 },
  { title: '操作', key: 'action', width: 120 }
]
const announcementPagination = reactive({ current: 1, pageSize: 20, total: 0, showTotal: (total: number) => `共 ${total} 条` })

// 成绩表数据
const scoreboardSearch = ref('')
const scoreboardData = ref([
  { rank: 1, username: '雨知非烟 (Q_Q)', realName: '祁锦倩', totalScore: 85, problem_1: '85' },
  { rank: 2, username: '王艺博', realName: '王艺博', totalScore: 52.7, problem_1: '52.7' }
])
const scoreboardColumns = computed(() => {
  const baseColumns = [
    { title: '名次', dataIndex: 'rank', key: 'rank', width: 80 },
    { title: '参赛者', dataIndex: 'username', key: 'username', width: 180 },
    { title: '真实姓名', dataIndex: 'realName', key: 'realName', width: 100 },
    { title: '总分', dataIndex: 'totalScore', key: 'totalScore', width: 80 }
  ]
  const problemCols = problems.value.map((_, i) => ({
    title: `客观题${i + 1}`,
    key: `problem_${i + 1}`,
    dataIndex: `problem_${i + 1}`,
    width: 100
  }))
  return [...baseColumns, ...problemCols]
})
const scoreboardPagination = reactive({ current: 1, pageSize: 20, total: 2, showTotal: (total: number) => `共 ${total} 条` })

// 提交数据
const submissionSearch = reactive({ userId: '', problemOrder: '', status: '' })
const submissions = ref([
  { id: '1', status: '55.5 Wrong Answer', problemOrder: '客观题1', problemId: 'P1511C', problemName: 'C++算法设计大赛模拟卷', userId: '21037829', username: '王艺博', submitTime: '昨天 16:45', remark: '赛中提交' }
])
const submissionColumns = [
  { title: '状态', key: 'status', width: 140 },
  { title: '题目顺序', dataIndex: 'problemOrder', key: 'problemOrder', width: 100 },
  { title: '题目编号', dataIndex: 'problemId', key: 'problemId', width: 100 },
  { title: '题目名称', dataIndex: 'problemName', key: 'problemName', width: 160 },
  { title: '用户ID', dataIndex: 'userId', key: 'userId', width: 100 },
  { title: '提交者', dataIndex: 'username', key: 'username', width: 120 },
  { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 120 },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 100 }
]
const submissionPagination = reactive({ current: 1, pageSize: 20, total: 1 })

// 搜索引用
const searchReferenceVisible = ref(false)
const batchReferenceVisible = ref(false)
const searchKeyword = ref('')
const batchProblemIds = ref('')
const searchResults = ref([
  { id: 'P1511C', name: 'C++算法设计大赛模拟赛' },
  { id: 'P10990', name: '麦波斯基数列' }
])
const searchColumns = [
  { title: '题目编号', dataIndex: 'id', key: 'id', width: 100 },
  { title: '标题', dataIndex: 'name', key: 'name' },
  { title: '操作', key: 'action', width: 80 }
]
const searchPagination = reactive({ current: 1, pageSize: 10, total: 100, showTotal: (total: number) => `共 ${total} 条` })

const getScoreClass = (score: string) => parseFloat(score) >= 60 ? 'score-pass' : 'score-fail'
const getStatusClass = (status: string) => status.includes('Accepted') ? 'status-accepted' : status.includes('Wrong') ? 'status-wrong' : ''

// 题目操作
const handleSearchReference = () => { searchReferenceVisible.value = true }
const handleBatchReference = () => { batchReferenceVisible.value = true }
const handleSearchProblems = () => { message.info('搜索题目（原型展示）') }
const handleAddProblem = (problem: any) => {
  if (problems.value.find(p => p.id === problem.id)) { message.warning('该题目已存在'); return }
  problems.value.push({ id: problem.id, name: problem.name, difficulty: '入门', tags: [], createdAt: new Date().toLocaleString() })
  message.success(`已添加题目 ${problem.id}`)
}
const handleBatchReferenceOk = () => {
  if (!batchProblemIds.value.trim()) { message.error('请输入题目编号'); return }
  message.success('批量添加成功')
  batchReferenceVisible.value = false
}
const handleRemoveProblem = (record: any) => {
  const index = problems.value.findIndex(p => p.id === record.id)
  if (index > -1) { problems.value.splice(index, 1); message.success('题目已移除') }
}
const handleRejudge = (record: any) => { message.info(`重测题目: ${record.id}（原型展示）`) }

// 公告操作
const handleCreateAnnouncement = () => {
  router.push({ name: 'GroupCreateContestAnnouncement', params: { id: groupId.value, contestId: contestId.value } })
}
const handleEditAnnouncement = (record: any) => { message.info(`编辑公告: ${record.id}（原型展示）`) }
const handleDeleteAnnouncement = (record: any) => { message.warning(`删除公告: ${record.id}（原型展示）`) }

// 成绩表操作
const handleSearchScoreboard = () => { message.info('搜索成绩表（原型展示）') }
const handleDownloadRegistration = () => { message.info('下载报名名单（原型展示）') }
const handleDownloadScoreboard = () => { message.info('下载实时成绩表（原型展示）') }

// 提交操作
const handleSearchSubmissions = () => { message.info('搜索提交（原型展示）') }
const handleDownloadContestSubmissions = () => { message.info('下载赛中提交（原型展示）') }
const handleDownloadAfterSubmissions = () => { message.info('下载赛后提交（原型展示）') }

onMounted(() => {
  if (route.query.tab) activeTab.value = route.query.tab as string
})
</script>

<style scoped>
.group-contest-detail { padding: 24px; }
.breadcrumb-area { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.header-tabs { display: flex; gap: 8px; }
.tab-content { background: #fff; padding: 16px; border-radius: 4px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-header h2 { margin: 0; }
.header-actions { display: flex; gap: 16px; align-items: center; }
.header-actions a { cursor: pointer; }
.search-area { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.table-area { border: 1px solid #f0f0f0; border-radius: 4px; }
.danger-link { color: #ff4d4f; }
.score-pass { color: #722ed1; }
.score-fail { color: #ff4d4f; }
.status-accepted { color: #52c41a; }
.status-wrong { color: #ff4d4f; }
</style>
