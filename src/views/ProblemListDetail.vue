<template>
  <div class="problem-list-detail">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-area">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <router-link to="/problem-lists">题单管理</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ problemListName }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="header-actions">
        <a-button type="primary" @click="handleManageProblems">管理题目</a-button>
        <a-button @click="handleCompletionStatus">完成情况</a-button>
      </div>
    </div>

    <div class="page-header">
      <h2>题单题目管理</h2>
      <div class="header-right">
        <a @click="handleAddChapter">增加章节</a>
        <a-divider type="vertical" />
        <a @click="handleSortChapters">章节排序</a>
      </div>
    </div>

    <!-- 章节列表 -->
    <div class="chapters-area">
      <div v-for="(chapter, index) in chapters" :key="chapter.id" class="chapter-item">
        <div class="chapter-header" @click="toggleChapter(chapter.id)">
          <div class="chapter-title">
            <span class="expand-icon">{{ expandedChapters.includes(chapter.id) ? '▼' : '▶' }}</span>
            <span>章节 {{ index + 1 }}：{{ chapter.name }}</span>
          </div>
          <div class="chapter-actions" @click.stop>
            <a @click="handleSearchReference(chapter)">搜索引用</a>
            <a @click="handleBatchReference(chapter)">批量引用</a>
            <a @click="handleEditChapter(chapter)">编辑</a>
            <a @click="handleDeleteChapter(chapter)" class="danger-link">删除</a>
          </div>
        </div>
        <div v-if="expandedChapters.includes(chapter.id) && chapter.problems.length > 0" class="chapter-content">
          <a-table
            :columns="problemColumns"
            :data-source="chapter.problems"
            :pagination="false"
            row-key="id"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'difficulty'">
                <span>{{ record.difficulty }}</span>
              </template>
              <template v-else-if="column.key === 'tags'">
                <a-tag v-for="tag in record.tags" :key="tag" style="margin-right: 4px">{{ tag }}</a-tag>
              </template>
              <template v-else-if="column.key === 'action'">
                <a @click="handleRemoveProblem(chapter, record)" class="danger-link">移除</a>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>

    <!-- 创建章节弹窗 -->
    <a-modal v-model:open="createChapterVisible" title="创建章节" @ok="handleCreateChapterOk">
      <a-form layout="vertical">
        <a-form-item label="章节名称" required>
          <a-input v-model:value="newChapterName" placeholder="请输入章节名称" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑章节弹窗 -->
    <a-modal v-model:open="editChapterVisible" title="编辑章节" @ok="handleEditChapterOk">
      <a-form layout="vertical">
        <a-form-item label="章节名称" required>
          <a-input v-model:value="editChapterName" placeholder="请输入章节名称" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 搜索引用弹窗 -->
    <a-modal v-model:open="searchReferenceVisible" title="搜索引用题目" width="700px" :footer="null">
      <div class="search-reference-content">
        <a-input-search v-model:value="searchKeyword" placeholder="请输入关键词" @search="handleSearchProblems" style="margin-bottom: 16px" />
        <a-table :columns="searchColumns" :data-source="searchResults" :pagination="searchPagination" row-key="id" size="small">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a @click="handleAddProblem(record)">添加</a>
            </template>
          </template>
        </a-table>
      </div>
    </a-modal>

    <!-- 批量引用弹窗 -->
    <a-modal v-model:open="batchReferenceVisible" title="批量引用题目" @ok="handleBatchReferenceOk">
      <a-input v-model:value="batchProblemIds" placeholder="请输入题目编号，逗号间隔" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

interface ChapterProblem {
  id: string
  name: string
  difficulty: string
  tags: string[]
  createdAt: string
}

interface Chapter {
  id: string
  name: string
  problems: ChapterProblem[]
}

const route = useRoute()
const router = useRouter()

const problemListId = ref(route.params.id as string)
const problemListName = ref('历年CSP-J题目汇总【00004】')

// 章节数据
const chapters = ref<Chapter[]>([
  {
    id: '1',
    name: '2023',
    problems: [
      { id: 'P1858', name: '[CSP-J 2023] 小苹果', difficulty: '普及-', tags: ['递推'], createdAt: '2024-08-20 16:59:01' },
      { id: 'P1859', name: '[CSP-J 2023] 公路', difficulty: '普及-', tags: ['贪心'], createdAt: '2024-08-20 16:59:01' },
      { id: 'P1860', name: '[CSP-J 2023] 一元二次方程', difficulty: '普及/提高-', tags: ['模拟'], createdAt: '2024-08-20 16:59:01' },
      { id: 'P1861', name: '[CSP-J 2023] 旅游巴士', difficulty: '普及+/提高', tags: ['最短路', '分层图', 'Dijkstra 算法'], createdAt: '2024-08-20 16:59:01' }
    ]
  },
  { id: '2', name: '2022', problems: [] },
  { id: '3', name: '2021', problems: [] },
  { id: '4', name: '2020', problems: [] },
  { id: '5', name: '2019', problems: [] },
  { id: '6', name: '2024', problems: [] }
])

const expandedChapters = ref<string[]>(['1'])

// 弹窗状态
const createChapterVisible = ref(false)
const editChapterVisible = ref(false)
const searchReferenceVisible = ref(false)
const batchReferenceVisible = ref(false)

const newChapterName = ref('')
const editChapterName = ref('')
const editingChapter = ref<Chapter | null>(null)
const currentChapter = ref<Chapter | null>(null)
const searchKeyword = ref('')
const batchProblemIds = ref('')

// 搜索结果
const searchResults = ref([
  { id: 'P1511C', name: 'C++算法设计大赛模拟赛' },
  { id: 'P10990', name: '麦波斯基数列' },
  { id: 'P10988', name: '奇怪的电梯' },
  { id: 'P10987', name: '抓住那头牛' },
  { id: 'P10986', name: '阿号选择' },
  { id: 'P10985', name: '自动化机器' },
  { id: 'P10984', name: '爱好' },
  { id: 'P10983', name: '替换' },
  { id: 'P10982', name: '斜述' },
  { id: 'P10981', name: '站厅' }
])

const searchPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 41403,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
})

// 表格列定义
const problemColumns = [
  { title: '题目编号', dataIndex: 'id', key: 'id', width: 100 },
  { title: '名称', dataIndex: 'name', key: 'name', width: 200 },
  { title: '难度', key: 'difficulty', width: 100 },
  { title: '题目标签', key: 'tags', width: 200 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
  { title: '操作', key: 'action', width: 80 }
]

const searchColumns = [
  { title: '题目编号', dataIndex: 'id', key: 'id', width: 100 },
  { title: '标题', dataIndex: 'name', key: 'name' },
  { title: '操作', key: 'action', width: 80 }
]

// 展开/收起章节
const toggleChapter = (chapterId: string) => {
  const index = expandedChapters.value.indexOf(chapterId)
  if (index > -1) {
    expandedChapters.value.splice(index, 1)
  } else {
    expandedChapters.value.push(chapterId)
  }
}

// 增加章节
const handleAddChapter = () => {
  newChapterName.value = ''
  createChapterVisible.value = true
}

const handleCreateChapterOk = () => {
  if (!newChapterName.value.trim()) {
    message.error('请输入章节名称')
    return
  }
  const newChapter: Chapter = {
    id: String(Date.now()),
    name: newChapterName.value,
    problems: []
  }
  chapters.value.push(newChapter)
  createChapterVisible.value = false
  message.success('章节创建成功')
}

// 编辑章节
const handleEditChapter = (chapter: Chapter) => {
  editingChapter.value = chapter
  editChapterName.value = chapter.name
  editChapterVisible.value = true
}

const handleEditChapterOk = () => {
  if (!editChapterName.value.trim()) {
    message.error('请输入章节名称')
    return
  }
  if (editingChapter.value) {
    editingChapter.value.name = editChapterName.value
  }
  editChapterVisible.value = false
  message.success('章节编辑成功')
}

// 删除章节
const handleDeleteChapter = (chapter: Chapter) => {
  const index = chapters.value.findIndex(c => c.id === chapter.id)
  if (index > -1) {
    chapters.value.splice(index, 1)
    message.success('章节删除成功')
  }
}

// 章节排序
const handleSortChapters = () => {
  message.info('章节排序（原型展示）')
}

// 搜索引用
const handleSearchReference = (chapter: Chapter) => {
  currentChapter.value = chapter
  searchKeyword.value = ''
  searchReferenceVisible.value = true
}

const handleSearchProblems = () => {
  message.info('搜索题目（原型展示）')
}

const handleAddProblem = (problem: { id: string; name: string }) => {
  if (currentChapter.value) {
    const exists = currentChapter.value.problems.find(p => p.id === problem.id)
    if (exists) {
      message.warning('该题目已存在于当前章节')
      return
    }
    currentChapter.value.problems.push({
      id: problem.id,
      name: problem.name,
      difficulty: '普及-',
      tags: [],
      createdAt: new Date().toLocaleString()
    })
    message.success(`已添加题目 ${problem.id}`)
  }
}

// 批量引用
const handleBatchReference = (chapter: Chapter) => {
  currentChapter.value = chapter
  batchProblemIds.value = ''
  batchReferenceVisible.value = true
}

const handleBatchReferenceOk = () => {
  if (!batchProblemIds.value.trim()) {
    message.error('请输入题目编号')
    return
  }
  const ids = batchProblemIds.value.split(',').map(id => id.trim()).filter(id => id)
  if (currentChapter.value) {
    ids.forEach(id => {
      const exists = currentChapter.value!.problems.find(p => p.id === id)
      if (!exists) {
        currentChapter.value!.problems.push({
          id,
          name: `题目 ${id}`,
          difficulty: '普及-',
          tags: [],
          createdAt: new Date().toLocaleString()
        })
      }
    })
    message.success(`已批量添加 ${ids.length} 道题目`)
  }
  batchReferenceVisible.value = false
}

// 移除题目
const handleRemoveProblem = (chapter: Chapter, problem: ChapterProblem) => {
  const index = chapter.problems.findIndex(p => p.id === problem.id)
  if (index > -1) {
    chapter.problems.splice(index, 1)
    message.success('题目已移除')
  }
}

// 管理题目
const handleManageProblems = () => {
  message.info('管理题目（原型展示）')
}

// 完成情况
const handleCompletionStatus = () => {
  router.push({ name: 'ProblemListCompletion', params: { id: problemListId.value } })
}

onMounted(() => {
  // 可以根据路由参数加载题单数据
})
</script>

<style scoped>
.problem-list-detail {
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

.header-right a {
  margin-left: 16px;
}

.chapters-area {
  background: #fff;
}

.chapter-item {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-bottom: 24px;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
}

.chapter-header:hover {
  background: #fafafa;
}

.chapter-title {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.expand-icon {
  margin-right: 8px;
  font-size: 12px;
  color: #999;
}

.chapter-actions a {
  margin-left: 16px;
}

.chapter-content {
  padding: 0 16px 16px;
}

.danger-link {
  color: #ff4d4f;
}

.danger-link:hover {
  color: #ff7875;
}

.search-reference-content {
  max-height: 500px;
}
</style>
