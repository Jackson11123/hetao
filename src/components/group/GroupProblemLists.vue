<template>
  <div class="group-problem-lists">
    <div class="lists-header">
      <h3>小组题单管理</h3>
      <a-space>
        <a-button @click="handleSearchRef">搜索引用</a-button>
        <a-button type="primary" @click="handleCreate">创建题单</a-button>
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
      :data-source="problemLists"
      :pagination="{ pageSize: 20, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <div>
            <div>{{ record.title }}</div>
            <a-tag v-if="record.isRef" color="orange" size="small">引自其他小组</a-tag>
          </div>
        </template>
        <template v-if="column.key === 'permission'">
          <span>{{ record.permission === '公开题单' ? '公开' : '私密' }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <a-space v-if="record.isRef" :wrap="false">
            <a @click="handleViewProgress(record)">完成情况</a>
            <a-divider type="vertical" />
            <a @click="handleRemove(record)" class="danger-link">移除</a>
          </a-space>
          <a-space v-else :wrap="false">
            <a @click="handleViewProgress(record)">完成情况</a>
            <a-divider type="vertical" />
            <a @click="handleManageProblems(record)">管理题目</a>
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

    <!-- 搜索引用题单弹窗 -->
    <a-modal
      v-model:open="searchRefModalVisible"
      title="搜索引用题单"
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

interface ProblemList {
  id: string
  title: string
  subtitle: string
  isRef: boolean
  owner: string
  problemCount: number
  createdAt: string
  lastModifiedBy: string
  permission: string
}

interface RefProblemList {
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
const searchRefResults = ref<RefProblemList[]>([
  { id: 'G10357', title: '1', added: false },
  { id: 'G10356', title: 'OJ特训练习', added: false },
  { id: 'G10355', title: '小灶课题目练习', added: false },
  { id: 'G00908', title: '【进制转换1】', added: false },
  { id: 'G00907', title: '有看龙岛异兽的么', added: false },
  { id: 'G00906', title: '【一层循环加强】', added: false },
  { id: 'G00905', title: '背包问题入门题单', added: false },
  { id: 'G00904', title: '入门赛', added: false },
  { id: 'G00903', title: 'COCI', added: false },
  { id: 'G00902', title: 'UVA', added: false },
])
const searchRefColumns = [
  { title: '题单编号', dataIndex: 'id', key: 'id', width: 120 },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '操作', key: 'action', width: 80, align: 'right' as const },
]
const searchRefPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 1137,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

const problemLists = ref<ProblemList[]>([
  {
    id: 'G00909',
    title: '测试用',
    subtitle: 'test',
    isRef: false,
    owner: 'hetao59755186',
    problemCount: 5,
    createdAt: '2025-12-05 10:23:31',
    lastModifiedBy: 'hetao59755186',
    permission: '公开题单',
  },
  {
    id: 'G00857',
    title: '系列题目',
    subtitle: '系列题目',
    isRef: true,
    owner: '亮闪闪的黄金',
    problemCount: 0,
    createdAt: '2025-11-09 21:54:28',
    lastModifiedBy: '亮闪闪的黄金',
    permission: '公开题单',
  },
  {
    id: 'G00856',
    title: '七阶段题单BETA',
    subtitle: '这是什么？七阶段题单！',
    isRef: true,
    owner: '洲洋老师',
    problemCount: 3,
    createdAt: '2025-11-06 16:34:21',
    lastModifiedBy: '洲洋老师',
    permission: '私密题单',
  },
  {
    id: 'G00808',
    title: '【C++1-12-循环2】',
    subtitle: '【C++1-12-循环2】',
    isRef: true,
    owner: '韩涛',
    problemCount: 0,
    createdAt: '2025-11-03 10:37:45',
    lastModifiedBy: '韩涛',
    permission: '公开题单',
  },
])

const columns = [
  { title: '题单编号', dataIndex: 'id', key: 'id', width: 100 },
  { title: '标题', key: 'title', width: 200 },
  { title: '副标题', dataIndex: 'subtitle', key: 'subtitle', width: 150 },
  { title: '题单所有者', dataIndex: 'owner', key: 'owner', width: 120 },
  { title: '题目数', dataIndex: 'problemCount', key: 'problemCount', width: 80 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  { title: '最近修改人', dataIndex: 'lastModifiedBy', key: 'lastModifiedBy', width: 100 },
  { title: '权限', key: 'permission', width: 120 },
  { title: '操作', key: 'action', width: 340 },
]

const handleSearch = () => {
  message.info('搜索题单（原型展示）')
}

const handleSearchRef = () => {
  searchRefModalVisible.value = true
}

const doSearchRef = () => {
  message.info('搜索引用题单（原型展示）')
}

const handleAddRef = (record: RefProblemList) => {
  record.added = true
  // 添加到题单列表
  problemLists.value.push({
    id: record.id,
    title: record.title,
    subtitle: record.title,
    isRef: true,
    owner: '其他小组',
    problemCount: 0,
    createdAt: new Date().toLocaleString(),
    lastModifiedBy: '-',
    permission: '公开题单',
  })
  message.success(`已添加题单: ${record.title}`)
}

const handleCreate = () => {
  router.push({ name: 'GroupCreateProblemList', params: { id: groupId } })
}

const handleViewProgress = (record: ProblemList) => {
  message.info(`查看完成情况: ${record.title}（原型展示）`)
}

const handleManageProblems = (record: ProblemList) => {
  message.info(`管理题目: ${record.title}（原型展示）`)
}

const handleView = (record: ProblemList) => {
  message.info(`查看题单: ${record.title}（原型展示）`)
}

const handleEdit = (record: ProblemList) => {
  message.info(`编辑题单: ${record.title}（原型展示）`)
}

const handleRemove = (record: ProblemList) => {
  message.warning(`${record.isRef ? '移除' : '删除'}题单: ${record.title}（原型展示）`)
}
</script>

<style scoped>
.group-problem-lists {
  padding: 16px 0;
}

.lists-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.lists-header h3 {
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
