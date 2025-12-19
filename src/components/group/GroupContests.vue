<template>
  <div class="group-contests">
    <div class="contests-header">
      <h3>小组比赛管理</h3>
      <a-space>
        <a-button @click="handleSearchRef">搜索引用</a-button>
        <a-button type="primary" @click="handleCreate">创建比赛</a-button>
      </a-space>
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

    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="contests"
      :pagination="{ pageSize: 20, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
      row-key="id"
      :scroll="{ x: 1800 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <div>
            <div>{{ record.name }}</div>
            <a-tag v-if="record.isRef" color="orange" size="small">引自其他小组</a-tag>
          </div>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
        </template>
        <template v-if="column.key === 'permission'">
          <span>{{ record.permission }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <!-- 引用的比赛：只有完成情况和移除 -->
          <a-space v-if="record.isRef" :wrap="false">
            <a @click="handleAllSubmissions(record)">全部提交</a>
            <a-divider type="vertical" />
            <a @click="handleRanking(record)">成绩表</a>
            <a-divider type="vertical" />
            <a @click="handleRemove(record)" class="danger-link">移除</a>
          </a-space>
          <!-- 自己创建的比赛：完整操作 -->
          <a-space v-else :wrap="false">
            <a @click="handleAllSubmissions(record)">全部提交</a>
            <a-divider type="vertical" />
            <a @click="handleRanking(record)">成绩表</a>
            <a-divider type="vertical" />
            <a @click="handleManageProblems(record)">管理题目</a>
            <a-divider type="vertical" />
            <a @click="handleAnnouncement(record)">管理公告</a>
            <a-divider type="vertical" />
            <a @click="handleView(record)">查看</a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleRemove(record)" class="danger-link">删除</a>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 搜索引用比赛弹窗 -->
    <a-modal
      v-model:open="searchRefModalVisible"
      title="搜索引用比赛"
      :footer="null"
      width="700px"
    >
      <div class="search-ref-modal">
        <a-input
          v-model:value="searchRefKeyword"
          placeholder="请输入关键词"
          @pressEnter="doSearchRef"
        />
        <a-table
          :columns="searchRefColumns"
          :data-source="searchRefResults"
          :pagination="searchRefPagination"
          row-key="id"
          size="small"
          style="margin-top: 16px"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a v-if="!record.added" @click="handleAddRef(record)" class="primary-link">添加</a>
              <a-tag v-else color="green">已添加</a-tag>
            </template>
          </template>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

interface Contest {
  id: string
  name: string
  isRef: boolean
  owner: string
  duration: string
  format: string
  problemCount: number
  status: string
  registeredCount: number
  submittedCount: number
  reviewCount: number
  lastModifiedBy: string
  permission: string
}

interface RefContest {
  id: string
  title: string
  added: boolean
}

const router = useRouter()
const groupId = inject<string>('groupId', '')

const searchKeyword = ref('')

// 搜索引用弹窗相关
const searchRefModalVisible = ref(false)
const searchRefKeyword = ref('')
const searchRefResults = ref<RefContest[]>([
  { id: '22591049591552', title: '25秋季进阶班D-枚举法', added: false },
  { id: '22591042073856', title: 'A1期末考试', added: false },
  { id: '22591022108032', title: 'C++算法设计大赛初赛模拟卷1', added: false },
  { id: '22590999180416', title: '核桃编程2025年全国万人联考', added: false },
  { id: '22590995355904', title: '核桃编程2025年全国万人联考', added: false },
  { id: '22590973839104', title: '【089-Div.4】南宁三中信奥团队—新手组周赛', added: false },
  { id: '22590810333952', title: '25秋季启航班A-实战练习13', added: false },
  { id: '22590800438400', title: '25秋季进阶班C-实战练习13', added: false },
  { id: '22590751280768', title: '25秋季跳级班Z-枚举法', added: false },
  { id: '22590749753216', title: '25秋季进阶班A-枚举法', added: false },
])
const searchRefColumns = [
  { title: '比赛ID', dataIndex: 'id', key: 'id', width: 140 },
  { title: '比赛标题', dataIndex: 'title', key: 'title' },
  { title: '操作', key: 'action', width: 80, align: 'right' as const },
]
const searchRefPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 3887,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

const contests = ref<Contest[]>([
  { id: '001', name: '测试用2', isRef: false, owner: 'hetao59755186', duration: '10小时18分钟', format: 'OI', problemCount: 9, status: '进行中', registeredCount: 1, submittedCount: 1, reviewCount: 1, lastModifiedBy: '', permission: '公开比赛' },
  { id: '002', name: '【HT-075-Div.4】核桃新手组周赛', isRef: false, owner: 'Melly', duration: '7日', format: '乐多', problemCount: 4, status: '进行中', registeredCount: 0, submittedCount: 0, reviewCount: 0, lastModifiedBy: '', permission: '公开比赛' },
  { id: '003', name: '这是一个比赛1110_又八生日快乐', isRef: false, owner: 'Mark_Ultra', duration: '1年20日', format: 'OI', problemCount: 0, status: '进行中', registeredCount: 2, submittedCount: 0, reviewCount: 0, lastModifiedBy: '', permission: '公开比赛' },
  { id: '004', name: '测试用', isRef: false, owner: 'hetao59755186', duration: '1小时13分钟', format: 'IOI', problemCount: 5, status: '已结束', registeredCount: 1, submittedCount: 1, reviewCount: 1, lastModifiedBy: '', permission: '公开比赛' },
  { id: '005', name: 'Mark的测试比赛03', isRef: true, owner: 'Mark小号', duration: '3分钟16秒', format: 'OI', problemCount: 1, status: '已结束', registeredCount: 1, submittedCount: 1, reviewCount: 1, lastModifiedBy: '', permission: '私密比赛' },
  { id: '006', name: 'Mark测试用比赛', isRef: true, owner: 'Mark小号', duration: '1小时8秒', format: 'OI', problemCount: 1, status: '已结束', registeredCount: 1, submittedCount: 1, reviewCount: 1, lastModifiedBy: '', permission: '私密比赛' },
])

const columns = [
  { title: '比赛名称', key: 'name', width: 220 },
  { title: '比赛所有者', dataIndex: 'owner', key: 'owner', width: 130 },
  { title: '比赛时长', dataIndex: 'duration', key: 'duration', width: 110 },
  { title: '赛制', dataIndex: 'format', key: 'format', width: 60 },
  { title: '题目数', dataIndex: 'problemCount', key: 'problemCount', width: 70 },
  { title: '比赛状态', key: 'status', width: 90 },
  { title: '报名人数', dataIndex: 'registeredCount', key: 'registeredCount', width: 90 },
  { title: '提交人数', dataIndex: 'submittedCount', key: 'submittedCount', width: 90 },
  { title: '补题人数', dataIndex: 'reviewCount', key: 'reviewCount', width: 90 },
  { title: '最近修改人', dataIndex: 'lastModifiedBy', key: 'lastModifiedBy', width: 100 },
  { title: '权限', key: 'permission', width: 90 },
  { title: '操作', key: 'action', width: 480, fixed: 'right' as const },
]

const getStatusColor = (status: string) => {
  if (status === '未开始') return 'default'
  if (status === '进行中') return 'processing'
  if (status === '已结束') return 'success'
  return 'default'
}

const handleSearch = () => {
  message.info('搜索比赛（原型展示）')
}

const handleSearchRef = () => {
  searchRefModalVisible.value = true
}

const doSearchRef = () => {
  message.info('搜索引用比赛（原型展示）')
}

const handleAddRef = (record: RefContest) => {
  record.added = true
  // 添加到比赛列表
  contests.value.push({
    id: record.id,
    name: record.title,
    isRef: true,
    owner: '其他小组',
    duration: '-',
    format: '-',
    problemCount: 0,
    status: '未开始',
    registeredCount: 0,
    submittedCount: 0,
    reviewCount: 0,
    lastModifiedBy: '-',
    permission: '公开比赛',
  })
  message.success(`已添加比赛: ${record.title}`)
}

const handleCreate = () => {
  router.push({ name: 'GroupCreateContest', params: { id: groupId } })
}

const handleAllSubmissions = (record: Contest) => {
  router.push({ name: 'GroupContestDetail', params: { id: groupId, contestId: record.id }, query: { tab: 'submissions' } })
}

const handleRanking = (record: Contest) => {
  router.push({ name: 'GroupContestDetail', params: { id: groupId, contestId: record.id }, query: { tab: 'scoreboard' } })
}

const handleManageProblems = (record: Contest) => {
  router.push({ name: 'GroupContestDetail', params: { id: groupId, contestId: record.id }, query: { tab: 'problems' } })
}

const handleAnnouncement = (record: Contest) => {
  router.push({ name: 'GroupContestDetail', params: { id: groupId, contestId: record.id }, query: { tab: 'announcements' } })
}

const handleView = (record: Contest) => {
  router.push({ name: 'GroupViewContest', params: { id: groupId, contestId: record.id } })
}

const handleEdit = (record: Contest) => {
  router.push({ name: 'GroupEditContest', params: { id: groupId, contestId: record.id } })
}

const handleRemove = (record: Contest) => {
  message.warning(`${record.isRef ? '移除' : '删除'}比赛: ${record.name}（原型展示）`)
}
</script>

<style scoped>
.group-contests {
  padding: 16px 0;
}

.contests-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.contests-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.search-area {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.danger-link {
  color: #ff4d4f;
}

.primary-link {
  color: #1890ff;
}

.search-ref-modal :deep(.ant-input) {
  border-radius: 4px;
}
</style>
