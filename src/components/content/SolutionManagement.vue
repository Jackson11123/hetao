<template>
  <div class="solution-management">
    <div class="page-header"><h2>题解管理</h2></div>
    <div class="search-area">
      <a-form layout="inline">
        <a-form-item label="请输入题解ID"><a-input v-model:value="searchForm.solutionId" placeholder="" style="width: 120px" allow-clear /></a-form-item>
        <a-form-item label="请输入评论ID"><a-input v-model:value="searchForm.commentId" placeholder="" style="width: 120px" allow-clear /></a-form-item>
        <a-form-item label="请输入评论关键字"><a-input v-model:value="searchForm.keyword" placeholder="" style="width: 140px" allow-clear /></a-form-item>
        <a-form-item label="请选择举报状态">
          <a-select v-model:value="searchForm.reportStatus" placeholder="" style="width: 120px" allow-clear>
            <a-select-option value="">全部</a-select-option><a-select-option value="举报">举报</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="请选择评论状态">
          <a-select v-model:value="searchForm.commentStatus" placeholder="" style="width: 120px" allow-clear>
            <a-select-option value="">全部</a-select-option><a-select-option value="公开">公开</a-select-option><a-select-option value="管理删除">管理删除</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="开始时间"><a-date-picker v-model:value="searchForm.startTime" placeholder="" style="width: 140px" /></a-form-item>
        <a-form-item>→</a-form-item>
        <a-form-item label="结束时间"><a-date-picker v-model:value="searchForm.endTime" placeholder="" style="width: 140px" /></a-form-item>
        <a-form-item label="最后操作人UID"><a-input v-model:value="searchForm.operatorUid" placeholder="" style="width: 120px" allow-clear /></a-form-item>
        <a-form-item><a-button type="primary" @click="handleSearch">搜索</a-button></a-form-item>
      </a-form>
    </div>
    <div class="table-area">
      <a-table :columns="columns" :data-source="tableData" :pagination="pagination" row-key="id" :scroll="{ x: 1400 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'reportCount'">
            <span v-if="record.reportCount > 0" class="text-warning">{{ record.reportCount }} <a class="report-link">举报</a></span>
            <span v-else>{{ record.reportCount }}</span>
          </template>
          <template v-if="column.key === 'status'">
            <div class="status-cell">
              <span>{{ record.status }}</span>
              <span v-if="record.isOfficial" class="official-tag">官方</span>
            </div>
          </template>
          <template v-if="column.key === 'lastOperator'">
            <div class="operator-cell">
              <span>{{ record.lastOperator }}</span>
              <span v-if="record.lastOperateTime" class="operate-time">{{ record.lastOperateTime }}</span>
            </div>
          </template>
          <template v-if="column.key === 'action'"><a @click="handleManage(record)">管理</a></template>
        </template>
      </a-table>
    </div>

    <!-- 管理抽屉 -->
    <a-drawer
      v-model:open="drawerVisible"
      title="题解管理"
      placement="left"
      width="600"
      @close="handleDrawerClose"
    >
      <template #extra>
        <a href="#" target="_blank" class="preview-link">预览题解 <LinkOutlined /></a>
      </template>
      
      <div class="drawer-content" v-if="currentRecord">
        <!-- 基本信息 -->
        <div class="info-row">
          <div class="info-item">
            <span class="info-label">发布者ID</span>
            <span class="info-value">{{ currentRecord.publisherId }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发布者昵称</span>
            <span class="info-value">{{ currentRecord.publisherName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">状态</span>
            <span class="info-value">{{ currentRecord.status }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">点赞数</span>
            <span class="info-value">{{ currentRecord.likeCount }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">评论数</span>
            <span class="info-value">{{ currentRecord.commentCount }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">被举报次数</span>
            <span class="info-value">{{ currentRecord.reportCount }}</span>
          </div>
        </div>

        <!-- 编辑历史 -->
        <div class="section">
          <h4>编辑历史</h4>
          <div class="history-list">
            <div class="history-item" v-for="(item, index) in editHistory" :key="index">
              <span class="history-label">{{ item.label }}</span>
              <span class="history-time">{{ item.time }}</span>
            </div>
          </div>
        </div>

        <!-- 题解内容 -->
        <div class="section">
          <h3 class="solution-title">{{ currentRecord.solutionTitle }}</h3>
          
          <h4>题意</h4>
          <p class="solution-text">{{ currentRecord.problemDesc }}</p>
          
          <h4>解析</h4>
          <p class="solution-text">{{ currentRecord.analysis }}</p>
          <p class="solution-text" v-if="currentRecord.analysisNote">{{ currentRecord.analysisNote }}</p>
          
          <a href="#" class="link-text">{{ currentRecord.linkText }}</a>
          
          <p class="solution-text" v-if="currentRecord.extraContent">{{ currentRecord.extraContent }}</p>
        </div>
      </div>

      <template #footer>
        <div class="drawer-footer">
          <div class="footer-left">
            <a-button @click="handlePrev">上一条</a-button>
            <a-button @click="handleNext">下一条</a-button>
          </div>
          <div class="footer-center">
            <a-button @click="handleCancelOfficial">取消官方题解</a-button>
          </div>
          <div class="footer-right">
            <a-button type="primary" danger @click="handleDelete">删除</a-button>
          </div>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { LinkOutlined } from '@ant-design/icons-vue'
import type { Dayjs } from 'dayjs'

interface SolutionRecord {
  id: string
  problemId: string
  publisherId: string
  publisherName: string
  content: string
  likeCount: number
  commentCount: number
  reportCount: number
  submitTime: string
  status: string
  statusNote?: string
  lastOperator: string
  lastOperateTime?: string
  isOfficial?: boolean
  solutionTitle?: string
  problemDesc?: string
  analysis?: string
  analysisNote?: string
  linkText?: string
  extraContent?: string
}

const searchForm = reactive({ solutionId: '', commentId: '', keyword: '', reportStatus: '', commentStatus: '', startTime: null as Dayjs | null, endTime: null as Dayjs | null, operatorUid: '' })
const pagination = reactive({ pageSize: 10, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` })
const columns = [
  { title: '题目ID', dataIndex: 'problemId', key: 'problemId', width: 100 },
  { title: '发布者ID', dataIndex: 'publisherId', key: 'publisherId', width: 100 },
  { title: '发布者昵称', dataIndex: 'publisherName', key: 'publisherName', width: 120 },
  { title: '回复内容', dataIndex: 'content', key: 'content', width: 200, ellipsis: true },
  { title: '点赞数', dataIndex: 'likeCount', key: 'likeCount', width: 80 },
  { title: '评论数', dataIndex: 'commentCount', key: 'commentCount', width: 80 },
  { title: '被举报次数', key: 'reportCount', width: 100 },
  { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 160 },
  { title: '状态', key: 'status', width: 120 },
  { title: '最后操作人', key: 'lastOperator', width: 120 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
]

const tableData = ref<SolutionRecord[]>([
  { 
    id: '1', 
    problemId: '60087', 
    publisherId: '46166451', 
    publisherName: 'zls_XICK', 
    content: '最小斯坦纳树-状压dp题解', 
    likeCount: 10, 
    commentCount: 9, 
    reportCount: 1, 
    submitTime: '2025-06-29\n17:43:09', 
    status: '公开', 
    isOfficial: true,
    lastOperator: 'zls_XICK',
    lastOperateTime: '2025-11-09\n12:14:00',
    solutionTitle: '最小斯坦纳树-状压dp 题解',
    problemDesc: '无向连通图 S 中给定 k 个关键结点，构造一个包含这些结点的连通图，使边权和最小。',
    analysis: '显然，最后的结果一定是树，因为若有环存在，删除环任意一条边最终代价总会更小。',
    analysisNote: '注意到 1≤k≤10，显然可以使用状态 dp 处理。',
    linkText: '状压 dp 模板传送门',
    extraContent: '那么考虑以 i 为根节点、包含集合 S 的最小代价为 dp[i,S]，对于所有有关键点，仅包含它们自身且以它们自身为根节点的代价 dp[u,2^i] = 0，其余预处理为最大值。'
  },
  { 
    id: '2', 
    problemId: '55266', 
    publisherId: '7647861', 
    publisherName: '瓜灯', 
    content: '题解内容', 
    likeCount: 0, 
    commentCount: 4, 
    reportCount: 1, 
    submitTime: '2025-11-25\n16:36:50', 
    status: '公开', 
    isOfficial: true,
    lastOperator: '',
    lastOperateTime: '',
    solutionTitle: '题解',
    problemDesc: '',
    analysis: '',
  },
  { 
    id: '3', 
    problemId: '55267', 
    publisherId: '7647862', 
    publisherName: '用户A', 
    content: '另一个题解', 
    likeCount: 0, 
    commentCount: 0, 
    reportCount: 0, 
    submitTime: '2025-04-12\n13:10:21', 
    status: '公开', 
    isOfficial: true,
    lastOperator: '',
    lastOperateTime: '',
    solutionTitle: '题解',
    problemDesc: '',
    analysis: '',
  },
])

// 编辑历史
const editHistory = ref([
  { label: '首次发布', time: '2025-06-29 17:43:09' },
  { label: '第1次编辑', time: '2025-10-05 15:58:28' },
  { label: '第2次编辑', time: '2025-11-09 12:12:49' },
])

// 抽屉相关
const drawerVisible = ref(false)
const currentRecord = ref<SolutionRecord | null>(null)

const handleSearch = () => { message.info('搜索完成（原型展示）') }

const handleManage = (record: SolutionRecord) => {
  currentRecord.value = record
  drawerVisible.value = true
}

const handleDrawerClose = () => {
  drawerVisible.value = false
  currentRecord.value = null
}

const handlePrev = () => {
  message.info('上一条（原型展示）')
}

const handleNext = () => {
  message.info('下一条（原型展示）')
}

const handleCancelOfficial = () => {
  message.success('已取消官方题解（原型展示）')
}

const handleDelete = () => {
  message.success('题解已删除（原型展示）')
  drawerVisible.value = false
}
</script>

<style scoped>
.page-header { margin-bottom: 16px; }
.page-header h2 { margin: 0; }
.search-area { margin-bottom: 16px; padding: 16px; background: #fafafa; border-radius: 4px; }
.search-area :deep(.ant-form-item) { margin-bottom: 8px; }
.table-area { background: #fff; border: 1px solid #f0f0f0; border-radius: 4px; }
.text-warning { color: #faad14; }
.text-danger { color: #ff4d4f; }
.report-link { color: #1890ff; margin-left: 4px; }

.status-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.official-tag {
  display: inline-block;
  padding: 2px 6px;
  font-size: 12px;
  color: #52c41a;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
  width: fit-content;
}

.operator-cell {
  display: flex;
  flex-direction: column;
  font-size: 13px;
}

.operate-time {
  color: #999;
  font-size: 12px;
}

/* 抽屉样式 */
.preview-link {
  color: #1890ff;
}

.drawer-content {
  padding: 0;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  min-width: 100px;
}

.info-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  color: #333;
}

.section {
  margin-bottom: 24px;
}

.section h4 {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 16px 0 8px;
}

.history-list {
  background: #fafafa;
  border-radius: 4px;
  padding: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.history-item:last-child {
  border-bottom: none;
}

.history-label {
  color: #666;
}

.history-time {
  color: #999;
  font-family: monospace;
}

.solution-title {
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0;
}

.solution-text {
  color: #333;
  line-height: 1.8;
  margin: 8px 0;
}

.link-text {
  color: #1890ff;
  display: block;
  margin: 8px 0;
}

.drawer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  display: flex;
  gap: 8px;
}

.footer-center {
  display: flex;
  justify-content: center;
}

.footer-right {
  display: flex;
  gap: 8px;
}
</style>
