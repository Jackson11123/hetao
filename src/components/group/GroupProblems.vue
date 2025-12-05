<template>
  <div class="group-problems">
    <div class="problems-header">
      <h3>小组题目管理</h3>
      <a-space>
        <a-button @click="handleSearchRef">搜索引用</a-button>
        <a-button @click="handleBatchRef">批量引用</a-button>
        <a-button @click="handleCreateOJ">创建OJ题</a-button>
        <a-button @click="handleCreateObjective">创建客观题</a-button>
        <a-button type="primary" @click="handleBatchCopy">批量复制</a-button>
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
      :data-source="problems"
      :pagination="{ pageSize: 20, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <div>
            <span>{{ record.name }}</span>
            <a-tag v-if="record.isRef" color="orange" size="small" style="margin-left: 8px">引用公域</a-tag>
          </div>
        </template>
        <template v-if="column.key === 'difficulty'">
          <a-tag :color="getDifficultyColor(record.difficulty)">{{ record.difficulty }}</a-tag>
        </template>
        <template v-if="column.key === 'tags'">
          <a-tag v-for="tag in record.tags" :key="tag" style="margin-right: 4px">{{ tag }}</a-tag>
        </template>
        <template v-if="column.key === 'permission'">
          <a-select :value="record.permission" size="small" style="width: 100px">
            <a-select-option value="私密题目">私密题目</a-select-option>
            <a-select-option value="公开题目">公开题目</a-select-option>
          </a-select>
        </template>
        <template v-if="column.key === 'action'">
          <a @click="handleRemove(record)" class="danger-link">移除</a>
        </template>
      </template>
    </a-table>

    <!-- 搜索引用题目弹窗 -->
    <a-modal
      v-model:open="searchRefModalVisible"
      title="搜索引用题目"
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

    <!-- 批量引用题目弹窗 -->
    <a-modal
      v-model:open="batchRefModalVisible"
      title="批量引用题目"
      :footer="null"
      width="600px"
    >
      <div class="batch-ref-modal">
        <a-input-search
          v-model:value="batchRefInput"
          placeholder="请输入题目编号，逗号间隔"
          enter-button="添 加"
          @search="doBatchRef"
        >
          <template #enterButton>
            <a-button type="primary">添 加</a-button>
          </template>
        </a-input-search>
      </div>
    </a-modal>

    <!-- 批量复制题目弹窗 -->
    <a-modal
      v-model:open="batchCopyModalVisible"
      title="批量复制题目"
      :footer="null"
      width="600px"
    >
      <div class="batch-copy-modal">
        <a-input-search
          v-model:value="batchCopyInput"
          placeholder="请输入题目编号，逗号间隔"
          enter-button="检 索"
          @search="doBatchCopy"
        >
          <template #enterButton>
            <a-button type="primary">检 索</a-button>
          </template>
        </a-input-search>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

interface Problem {
  id: string
  name: string
  isRef: boolean
  owner: string
  difficulty: string
  tags: string[]
  createdAt: string
  permission: string
}

interface RefProblem {
  id: string
  title: string
  added: boolean
}

const router = useRouter()
const groupId = inject<string>('groupId', '')

const searchKeyword = ref('')

const problems = ref<Problem[]>([
  { id: 'P10984', name: '爱好', isRef: true, owner: 'TomAnderson', difficulty: '普及-', tags: ['简单DP', '数学', '递推'], createdAt: '2025-12-04 14:21:04', permission: '私密题目' },
  { id: 'P10983', name: '替换', isRef: true, owner: 'TomAnderson', difficulty: '入门', tags: ['双指针', '新手组', '贪心'], createdAt: '2025-12-04 14:20:37', permission: '私密题目' },
  { id: 'P10982', name: '科场', isRef: true, owner: 'TomAnderson', difficulty: '入门', tags: ['模拟', '新手组'], createdAt: '2025-12-04 14:20:02', permission: '私密题目' },
  { id: 'P10981', name: '切片', isRef: true, owner: 'TomAnderson', difficulty: '入门', tags: ['模拟', '新手组', '分类讨论'], createdAt: '2025-12-04 14:19:32', permission: '私密题目' },
  { id: 'P10856', name: '询问', isRef: true, owner: 'TomAnderson', difficulty: '暂无评定', tags: ['NOP'], createdAt: '2025-11-06 14:50:42', permission: '公开题目' },
  { id: 'P10855', name: '区间', isRef: true, owner: 'TomAnderson', difficulty: '暂无评定', tags: ['NOP'], createdAt: '2025-11-06 14:45:28', permission: '公开题目' },
  { id: 'P10854', name: '操作', isRef: true, owner: 'TomAnderson', difficulty: '暂无评定', tags: ['NOP'], createdAt: '2025-11-06 14:39:51', permission: '公开题目' },
  { id: 'P10853', name: '正方形', isRef: true, owner: 'TomAnderson', difficulty: '暂无评定', tags: ['NOP'], createdAt: '2025-11-06 14:11:19', permission: '公开题目' },
])

const columns = [
  { title: '题目编号', dataIndex: 'id', key: 'id', width: 100 },
  { title: '名称', key: 'name', width: 180 },
  { title: '题目所有者', dataIndex: 'owner', key: 'owner', width: 120 },
  { title: '难度', key: 'difficulty', width: 100 },
  { title: '题目标签', key: 'tags', width: 200 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  { title: '权限', key: 'permission', width: 120 },
  { title: '操作', key: 'action', width: 80 },
]

// 搜索引用弹窗相关
const searchRefModalVisible = ref(false)
const searchRefKeyword = ref('')
const searchRefResults = ref<RefProblem[]>([
  { id: 'GP19838', title: '[TJOI2019] 大中锋的游乐场', added: false },
  { id: 'GP19837', title: '最强欢呼', added: false },
  { id: 'P1511C', title: 'C++算法设计大赛模拟卷', added: false },
  { id: 'GP19836', title: '成绩分析', added: false },
  { id: 'GP6845C', title: '11', added: true },
  { id: 'GP19835', title: '成绩统计', added: true },
  { id: 'GP19834', title: '成绩排序', added: false },
  { id: 'GP19833', title: '成绩前三名', added: false },
  { id: 'GP6844C', title: 'k进制转10进制练习1', added: true },
  { id: 'GP19832', title: '[CSP-J 2023] 旅游巴士', added: false },
])
const searchRefColumns = [
  { title: '题目编号', dataIndex: 'id', key: 'id', width: 120 },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '操作', key: 'action', width: 80, align: 'right' as const },
]
const searchRefPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 61072,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 批量引用弹窗相关
const batchRefModalVisible = ref(false)
const batchRefInput = ref('')

// 批量复制弹窗相关
const batchCopyModalVisible = ref(false)
const batchCopyInput = ref('')

const getDifficultyColor = (difficulty: string) => {
  const colorMap: Record<string, string> = {
    '入门': 'green',
    '普及-': 'cyan',
    '普及': 'blue',
    '提高': 'orange',
    '省选': 'red',
    '暂无评定': 'default',
  }
  return colorMap[difficulty] || 'default'
}

const handleSearch = () => {
  message.info('搜索题目（原型展示）')
}

const handleSearchRef = () => {
  searchRefModalVisible.value = true
}

const doSearchRef = () => {
  message.info('搜索引用题目（原型展示）')
}

const handleAddRef = (record: RefProblem) => {
  record.added = true
  message.success(`已添加题目: ${record.title}`)
}

const handleBatchRef = () => {
  batchRefModalVisible.value = true
}

const doBatchRef = () => {
  if (!batchRefInput.value) {
    message.warning('请输入题目编号')
    return
  }
  message.success('批量引用成功（原型展示）')
  batchRefModalVisible.value = false
  batchRefInput.value = ''
}

const handleCreateOJ = () => {
  router.push({ name: 'GroupCreateProblem', params: { id: groupId } })
}

const handleCreateObjective = () => {
  router.push({ name: 'GroupCreateObjective', params: { id: groupId } })
}

const handleBatchCopy = () => {
  batchCopyModalVisible.value = true
}

const doBatchCopy = () => {
  if (!batchCopyInput.value) {
    message.warning('请输入题目编号')
    return
  }
  message.success('批量复制检索成功（原型展示）')
}

const handleRemove = (record: Problem) => {
  message.warning(`移除题目: ${record.name}（原型展示）`)
}
</script>

<style scoped>
.group-problems {
  padding: 16px 0;
}

.problems-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.problems-header h3 {
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

.batch-ref-modal,
.batch-copy-modal {
  padding: 8px 0;
}

.batch-ref-modal :deep(.ant-input-search-button),
.batch-copy-modal :deep(.ant-input-search-button) {
  background: #6366f1;
  border-color: #6366f1;
}

.batch-ref-modal :deep(.ant-input-search-button:hover),
.batch-copy-modal :deep(.ant-input-search-button:hover) {
  background: #4f46e5;
  border-color: #4f46e5;
}
</style>
