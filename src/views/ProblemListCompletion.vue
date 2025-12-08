<template>
  <div class="problem-list-completion">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-area">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <router-link to="/problem-lists">题单管理</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ problemListName }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="header-actions">
        <a-button @click="handleManageProblems">管理题目</a-button>
        <a-button type="primary" @click="handleCompletionStatus">完成情况</a-button>
      </div>
    </div>

    <div class="page-header">
      <h2>题单完成情况</h2>
      <a-button type="primary" @click="handleDownload">
        <template #icon><DownloadOutlined /></template>
        下载关闭题单完成情况
      </a-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <a-input v-model:value="searchKeyword" placeholder="请输入搜索关键字" style="width: 200px" />
      <a-button type="primary" @click="handleSearch">搜索</a-button>
    </div>

    <!-- 完成情况表格 -->
    <div class="table-area">
      <a-table
        :columns="columns"
        :data-source="completionData"
        :pagination="pagination"
        :scroll="{ x: 1800 }"
        row-key="userId"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key && column.key.startsWith('problem_')">
            <span :class="getStatusClass(record[column.key])">{{ record[column.key] || '-' }}</span>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { DownloadOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

const problemListId = ref(route.params.id as string)
const problemListName = ref('历年CSP-J题目汇总【00004】')
const searchKeyword = ref('')

// 题目列表（动态生成列）
const problems = ref([
  { id: 'P1858', name: '2023-P1858' },
  { id: 'P1859', name: '2023-P1859' },
  { id: 'P1860', name: '2023-P1860' },
  { id: 'P1861', name: '2023-P1861' },
  { id: 'P1866', name: '2022-P1866' },
  { id: 'P1867', name: '2022-P1867' },
  { id: 'P1868', name: '2022-P1868' }
])

// 动态生成表格列
const columns = computed(() => {
  const baseColumns = [
    { title: '用户ID', dataIndex: 'userId', key: 'userId', width: 100, fixed: 'left' as const },
    { title: '用户名', dataIndex: 'username', key: 'username', width: 120, fixed: 'left' as const },
    { title: '真实姓名', dataIndex: 'realName', key: 'realName', width: 100 },
    { title: '总分', dataIndex: 'totalScore', key: 'totalScore', width: 80 }
  ]
  const problemColumns = problems.value.map(p => ({
    title: p.name,
    dataIndex: `problem_${p.id}`,
    key: `problem_${p.id}`,
    width: 120
  }))
  return [...baseColumns, ...problemColumns]
})

// 完成情况数据
const completionData = ref([
  { userId: '24033714', username: 'hetao24033714', realName: '吴斯楠', totalScore: 0 },
  { userId: '15624829', username: '贝宇', realName: '赖轩宇', totalScore: 200, problem_P1860: '100 Accepted', problem_P1867: '100 Accepted' },
  { userId: '9072160', username: 'hetao9072160', realName: '雪碧', totalScore: 0 },
  { userId: '18801274', username: 'hetao18801274', realName: '胡钰宸', totalScore: 0 },
  { userId: '51166714', username: 'hetao91', realName: '钱禹成', totalScore: 400, problem_P1858: '100 Accepted', problem_P1859: '100 Accepted', problem_P1860: '100 Accepted', problem_P1861: '100 Accepted' },
  { userId: '44944617', username: '阮小姜', realName: '阮俊哲', totalScore: 0 },
  { userId: '10307247', username: '推男孩的小星星', realName: '李俊逸', totalScore: 400, problem_P1858: '100 Accepted', problem_P1866: '100 Accepted' },
  { userId: '38949341', username: 'hetao38949341', realName: '赵欣如', totalScore: 0 },
  { userId: '44590484', username: '来煌去敌', realName: '魏乾东', totalScore: 1900, problem_P1858: '100 Accepted', problem_P1859: '100 Accepted', problem_P1860: '100 Accepted', problem_P1861: '100 Accepted' },
  { userId: '37018500', username: '王乙帆', realName: '王颖帆', totalScore: 0 },
  { userId: '55502775', username: 'hetao55502775', realName: '郝振宁', totalScore: 0, problem_P1858: '0 Compile Error' },
  { userId: '13088467', username: 'hetao13088467', realName: '甄善博', totalScore: 200, problem_P1858: '100 Accepted' },
  { userId: '60500899', username: '比如机考-孔维倩', realName: '', totalScore: 0 },
  { userId: '54321758', username: '洛梦猴子1', realName: '张皓宁', totalScore: 300, problem_P1858: '100 Accepted' },
  { userId: '60490943', username: 'hetao60490943', realName: '', totalScore: 100, problem_P1858: '100 Accepted', problem_P1859: '0 Wrong Answer' }
])

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: completionData.value.length,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
})

// 获取状态样式
const getStatusClass = (status: string) => {
  if (!status) return ''
  if (status.includes('Accepted')) return 'status-accepted'
  if (status.includes('Wrong Answer')) return 'status-wrong'
  if (status.includes('Compile Error')) return 'status-error'
  return ''
}

const handleSearch = () => {
  message.info('搜索完成（原型展示）')
}

const handleDownload = () => {
  message.info('下载题单完成情况（原型展示）')
}

const handleManageProblems = () => {
  router.push({ name: 'ProblemListDetail', params: { id: problemListId.value } })
}

const handleCompletionStatus = () => {
  message.info('当前已在完成情况页面')
}
</script>

<style scoped>
.problem-list-completion {
  padding: 24px;
}

.breadcrumb-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-actions {
  display: flex;
  gap: 8px;
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

.status-accepted {
  color: #52c41a;
}

.status-wrong {
  color: #faad14;
}

.status-error {
  color: #ff4d4f;
}
</style>
