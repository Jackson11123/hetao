<template>
  <div class="user-detail">
    <!-- 用户详细信息 -->
    <div class="info-section">
      <h3>用户详细信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">用户头像</span>
          <span class="value">
            <a-avatar :size="48" :src="userInfo.avatar">{{ userInfo.nickname?.charAt(0) }}</a-avatar>
            <a style="margin-left: 8px" @click="handleViewHomepage">查看主页</a>
          </span>
        </div>
        <div class="info-item">
          <span class="label">核桃用户ID</span>
          <span class="value">{{ userInfo.userId }}</span>
        </div>
        <div class="info-item">
          <span class="label">核桃OJ用户ID</span>
          <span class="value">{{ userInfo.ojUserId }}</span>
        </div>
        <div class="info-item">
          <span class="label">用户昵称</span>
          <span class="value">{{ userInfo.nickname }}</span>
        </div>
        <div class="info-item">
          <span class="label">真实姓名</span>
          <span class="value">{{ userInfo.realName }}</span>
        </div>
        <div class="info-item">
          <span class="label">角色</span>
          <span class="value">{{ userInfo.role }}</span>
        </div>
        <div class="info-item">
          <span class="label">注册时间</span>
          <span class="value">{{ userInfo.createdAt }}</span>
        </div>
        <div class="info-item">
          <span class="label">当前状态</span>
          <span class="value">{{ userInfo.status }}</span>
        </div>
        <div class="info-item">
          <span class="label">刷题数</span>
          <span class="value">{{ userInfo.problemCount }}</span>
        </div>
        <div class="info-item">
          <span class="label">AC数</span>
          <span class="value">{{ userInfo.acCount }}</span>
        </div>
        <div class="info-item">
          <span class="label">参赛数</span>
          <span class="value">{{ userInfo.contestCount }}</span>
        </div>
        <div class="info-item">
          <span class="label">小组数</span>
          <span class="value">{{ userInfo.groupCount }}</span>
        </div>
        <div class="info-item">
          <span class="label">题解数</span>
          <span class="value">{{ userInfo.solutionCount }}</span>
        </div>
        <div class="info-item">
          <span class="label">发帖数</span>
          <span class="value">{{ userInfo.postCount }}</span>
        </div>
      </div>
    </div>

    <!-- 用户比赛数据 -->
    <div class="contest-section">
      <div class="section-header">
        <h3>用户比赛数据</h3>
        <div class="filter-area">
          <a-range-picker v-model:value="dateRange" placeholder="报名开始时间" style="width: 240px" />
          <span style="margin: 0 8px">—</span>
          <a-input v-model:value="searchContestTime" placeholder="报名结束时间" style="width: 120px" />
          <a-button type="primary" @click="handleSearchContest">搜索</a-button>
        </div>
      </div>
      <div class="table-area">
        <a-table :columns="contestColumns" :data-source="contestData" :pagination="contestPagination" row-key="id" :scroll="{ x: 1600 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'

const route = useRoute()
const userId = ref(route.params.id as string)

// 用户信息
const userInfo = reactive({
  userId: '5186024',
  ojUserId: 'b567e48ada03417d85050e7a39280b01',
  nickname: '邓惠yu',
  realName: '邓惠瑜',
  avatar: '',
  role: '普通用户',
  createdAt: '2024-09-01 13:36:57',
  status: '正常',
  problemCount: 90,
  acCount: 89,
  contestCount: 11,
  groupCount: 2,
  solutionCount: 0,
  postCount: 0
})

// 比赛数据筛选
const dateRange = ref<[Dayjs, Dayjs] | null>(null)
const searchContestTime = ref('')

// 比赛数据
const contestData = ref([
  { id: 1, name: 'C3 算法精讲 - 期中测试 - 万人联考', rank: '', score: '', signupTime: '2025-12-07 19:25:04', contestTime: '2025-07-14 21:31:00~2027-07-31 00:00:00', format: 'IOI', problemCount: 4, status: '进行中', source: '课程配套题库', owner: '董一级', city: 'cpp' },
  { id: 2, name: '算法精讲-阶段测试（C3_L15到校完成）', rank: '', score: '', signupTime: '2025-11-16 20:54:11', contestTime: '2025-06-20 17:00:00~2029-06-20 17:00:00', format: 'IOI', problemCount: 4, status: '进行中', source: '课程配套题库', owner: '董一级', city: 'cpp' },
  { id: 3, name: '【HT-081-Div.4】核桃新手场周赛', rank: '794', score: '0', signupTime: '2025-10-12 17:41:13', contestTime: '2025-10-09 18:00:00~2025-10-12 18:00:00', format: '乐多', problemCount: 4, status: '已结束', source: '公域', owner: '', city: '' },
  { id: 4, name: 'C2 语法深入 - 期中测试', rank: '', score: '', signupTime: '2025-05-31 10:04:59', contestTime: '2024-12-26 17:00:00~2027-11-30 18:09:00', format: 'IOI', problemCount: 4, status: '进行中', source: '课程配套题库', owner: '董一级', city: 'cpp' },
  { id: 5, name: '语法深入 - 阶段测试（L9 阶段完成）', rank: '', score: '', signupTime: '2025-05-18 19:59:45', contestTime: '2025-02-14 10:00:00~2026-12-01 00:00:00', format: 'IOI', problemCount: 4, status: '进行中', source: '课程配套题库', owner: '董一级', city: 'cpp' },
  { id: 6, name: '针对9月认证的--GESP二级报名测试卷', rank: '539', score: '236', signupTime: '2025-04-20 19:50:43', contestTime: '2025-07-13 23:59:00~2025-07-18 23:59:00', format: 'IOI(OFS)', problemCount: 4, status: '已结束', source: '比赛真题题库', owner: '新乙女堂', city: '' },
  { id: 7, name: 'STEMA模拟考', rank: '', score: '', signupTime: '2025-02-12 20:09:50', contestTime: '2025-01-11 00:00:00~2027-01-01 00:00:00', format: 'IOI', problemCount: 4, status: '进行中', source: '课程配套题库', owner: '董一级', city: 'cpp' },
  { id: 8, name: '语法精讲-Level 5 阶段测试', rank: '', score: '', signupTime: '2025-01-22 19:45:35', contestTime: '2025-08-31 18:00:00~2047-07-01 00:00:00', format: 'IOI', problemCount: 4, status: '进行中', source: '课程配套题库', owner: 'TomAnderson', city: 'cpp' },
  { id: 9, name: '语法精讲-Level 4 期中测试', rank: '1', score: '500', signupTime: '2024-12-08 18:56:27', contestTime: '2024-11-15 12:00:00~2025-03-03 19:05:00', format: 'IOI', problemCount: 5, status: '已结束', source: '课程配套题库', owner: 'TomAnderson', city: 'cpp' }
])

const contestColumns = [
  { title: '序号', dataIndex: 'id', key: 'id', width: 60 },
  { title: '比赛名称', dataIndex: 'name', key: 'name', width: 220 },
  { title: '比赛排名', dataIndex: 'rank', key: 'rank', width: 80 },
  { title: '比赛总分', dataIndex: 'score', key: 'score', width: 80 },
  { title: '报名时间', dataIndex: 'signupTime', key: 'signupTime', width: 160 },
  { title: '比赛赛期', dataIndex: 'contestTime', key: 'contestTime', width: 280 },
  { title: '赛制', dataIndex: 'format', key: 'format', width: 80 },
  { title: '题目数', dataIndex: 'problemCount', key: 'problemCount', width: 70 },
  { title: '状态', key: 'status', width: 80 },
  { title: '比赛来源', dataIndex: 'source', key: 'source', width: 120 },
  { title: '比赛所有人', dataIndex: 'owner', key: 'owner', width: 100 },
  { title: '比赛城', dataIndex: 'city', key: 'city', width: 60 }
]

const contestPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 9,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
})

const getStatusColor = (status: string) => {
  if (status === '进行中') return 'green'
  if (status === '已结束') return 'default'
  return 'blue'
}

const handleViewHomepage = () => {
  message.info('查看用户主页（原型展示）')
}

const handleSearchContest = () => {
  message.info('搜索比赛数据（原型展示）')
}

onMounted(() => {
  // 根据路由参数加载用户数据
  userInfo.userId = userId.value
})
</script>

<style scoped>
.user-detail {
  padding: 24px;
}

.info-section {
  background: #fff;
  padding: 24px;
  border-radius: 4px;
  margin-bottom: 24px;
}

.info-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item .label {
  color: #666;
  width: 100px;
  flex-shrink: 0;
}

.info-item .value {
  color: #333;
  display: flex;
  align-items: center;
}

.contest-section {
  background: #fff;
  padding: 24px;
  border-radius: 4px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.filter-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-area {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}
</style>
