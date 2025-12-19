<template>
  <div class="create-objective">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-area">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <router-link to="/problem-banks">题库管理</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link :to="`/problem-banks/${bankId}`">{{ bankName }}</router-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="content-box">
      <div class="page-header">
        <h2>创建客观题</h2>
        <a-button type="link" @click="handleCopyFromOther">从其他题目复制</a-button>
      </div>

      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="config" tab="题目配置">
          <a-form :model="formData" layout="vertical" class="problem-form">
        <!-- 标题 -->
        <a-form-item label="标题" required>
          <a-input v-model:value="formData.title" placeholder="请输入标题" />
        </a-form-item>

        <!-- 内容 -->
        <a-form-item label="内容" required>
          <div class="markdown-editor">
            <div class="editor-toolbar">
              <a-space>
                <a-button size="small" @click="insertFormat('bold')"><BoldOutlined /></a-button>
                <a-button size="small" @click="insertFormat('underline')"><UnderlineOutlined /></a-button>
                <a-button size="small" @click="insertFormat('italic')"><ItalicOutlined /></a-button>
                <a-button size="small" @click="insertFormat('strikethrough')"><StrikethroughOutlined /></a-button>
                <a-button size="small" @click="insertFormat('heading')">H</a-button>
                <a-button size="small" @click="insertFormat('subscript')">x₂</a-button>
                <a-button size="small" @click="insertFormat('superscript')">x²</a-button>
                <a-button size="small" @click="insertFormat('quote')"><MenuOutlined /></a-button>
                <a-button size="small" @click="insertFormat('ol')"><OrderedListOutlined /></a-button>
                <a-button size="small" @click="insertFormat('ul')"><UnorderedListOutlined /></a-button>
                <a-button size="small" @click="insertFormat('code')"><CodeOutlined /></a-button>
                <a-button size="small" @click="insertFormat('image')"><PictureOutlined /></a-button>
                <a-button size="small" @click="insertFormat('link')"><LinkOutlined /></a-button>
                <a-button size="small" @click="insertFormat('imageLink')"><FileImageOutlined /></a-button>
                <a-button size="small" @click="insertFormat('formula')">Ω</a-button>
                <a-button size="small" @click="insertFormat('table')"><TableOutlined /></a-button>
                <a-button size="small" @click="insertFormat('upload')"><UploadOutlined /></a-button>
                <a-button size="small" @click="insertFormat('uploadImage')"><CloudUploadOutlined /></a-button>
              </a-space>
              <a-space class="toolbar-right">
                <a-button size="small" @click="toggleFullscreen"><FullscreenOutlined /></a-button>
                <a-button size="small" @click="togglePreview"><EyeOutlined /></a-button>
                <a-button size="small"><CameraOutlined /></a-button>
                <a-button size="small"><CodeSandboxOutlined /></a-button>
                <a-button size="small"><MenuUnfoldOutlined /></a-button>
              </a-space>
            </div>
            <div class="editor-content">
              <div class="editor-input">
                <a-textarea
                  v-model:value="formData.content"
                  :auto-size="{ minRows: 12, maxRows: 20 }"
                  placeholder="请输入内容（支持Markdown格式）"
                />
                <div class="word-count">字数: {{ formData.content.length }}</div>
              </div>
              <div class="editor-preview" v-if="showPreview">
                <div class="preview-content">
                  <h3 class="preview-title">客观题试卷</h3>
                  <h4>一、单选题（每题 2 分，共 30 分）</h4>
                  <div class="question-item">
                    <p>1. 以下哪个编码不能表示数字 0</p>
                    <p class="select-hint" v-text="selectHintText"></p>
                    <ul>
                      <li>[00000000]<sub>反</sub></li>
                      <li>[11111111]<sub>反</sub></li>
                      <li>[10000000]<sub>补</sub></li>
                      <li>[10000000]<sub>原</sub></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="editor-footer">
              <a-checkbox v-model:checked="syncScroll">同步滚动</a-checkbox>
            </div>
          </div>
        </a-form-item>

        <!-- 答案 -->
        <a-form-item label="答案" required>
          <div class="answer-box">
            <pre>{{ answerTemplate }}</pre>
          </div>
        </a-form-item>

        <!-- 权限、难度、标签 -->
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="权限">
              <a-select v-model:value="formData.permission" placeholder="请选择权限">
                <a-select-option value="private">私密题目</a-select-option>
                <a-select-option value="public">公开题目</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="难度" required>
              <a-select v-model:value="formData.difficulty" placeholder="请选择题目难度">
                <a-select-option v-for="diff in difficulties" :key="diff" :value="diff">
                  {{ diff }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="标签">
              <a-select
                v-model:value="formData.tags"
                mode="multiple"
                placeholder="请选择标签"
                :options="tagOptions"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 是否在提交后显示答案 -->
        <a-form-item label="是否在提交后显示答案">
          <div class="switch-with-text">
            <a-switch v-model:checked="formData.showAnswer" />
            <span class="switch-text">{{ formData.showAnswer ? '是' : '否' }}</span>
          </div>
        </a-form-item>

        <!-- 操作按钮 -->
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSave">保 存</a-button>
            <a-button @click="handleCancel">取 消</a-button>
          </a-space>
        </a-form-item>
          </a-form>
        </a-tab-pane>

        <a-tab-pane key="solution" tab="题解上传">
          <div class="solution-upload">
            <!-- 题解标题行 -->
            <div class="solution-title-row">
              <span class="required-label">* 标题</span>
              <a-input
                v-model:value="solutionTitle"
                placeholder="好的标题可以吸引更多人哦"
                :maxlength="50"
                class="solution-title-input"
              />
              <span class="char-count">{{ solutionTitle.length }}/50</span>
              <a-checkbox v-model:checked="syncPublishAcademic" class="sync-checkbox">同步发布学术版</a-checkbox>
            </div>

            <!-- Markdown编辑器 -->
            <div class="markdown-editor solution-editor">
              <div class="editor-toolbar">
                <a-space>
                  <a-button size="small" @click="insertSolutionFormat('bold')"><BoldOutlined /></a-button>
                  <a-button size="small" @click="insertSolutionFormat('underline')"><UnderlineOutlined /></a-button>
                  <a-button size="small" @click="insertSolutionFormat('italic')"><ItalicOutlined /></a-button>
                  <a-button size="small" @click="insertSolutionFormat('strikethrough')"><StrikethroughOutlined /></a-button>
                  <a-divider type="vertical" />
                  <a-button size="small" @click="insertSolutionFormat('heading')">H<sub>1</sub></a-button>
                  <a-button size="small" @click="insertSolutionFormat('subscript')">x<sub>2</sub></a-button>
                  <a-button size="small" @click="insertSolutionFormat('superscript')">x<sup>2</sup></a-button>
                  <a-button size="small" @click="insertSolutionFormat('quote')">{{ '{}' }}</a-button>
                  <a-divider type="vertical" />
                  <a-button size="small" @click="insertSolutionFormat('ol')"><OrderedListOutlined /></a-button>
                  <a-button size="small" @click="insertSolutionFormat('ul')"><UnorderedListOutlined /></a-button>
                  <a-button size="small" @click="insertSolutionFormat('checklist')"><CheckSquareOutlined /></a-button>
                  <a-divider type="vertical" />
                  <a-button size="small" @click="insertSolutionFormat('code')">&lt;&gt;</a-button>
                  <a-button size="small" @click="insertSolutionFormat('inlineCode')"><MinusOutlined /></a-button>
                  <a-button size="small" @click="insertSolutionFormat('link')"><LinkOutlined /></a-button>
                  <a-button size="small" @click="insertSolutionFormat('image')"><PictureOutlined /></a-button>
                  <a-button size="small" @click="insertSolutionFormat('upload')"><UploadOutlined /></a-button>
                  <a-divider type="vertical" />
                  <a-button size="small" @click="insertSolutionFormat('table')"><TableOutlined /></a-button>
                  <a-button size="small" @click="insertSolutionFormat('chart')"><BarChartOutlined /></a-button>
                  <a-button size="small" @click="insertSolutionFormat('formula')"><FunctionOutlined /></a-button>
                  <a-divider type="vertical" />
                  <a-button size="small" @click="handleUndo"><UndoOutlined /></a-button>
                  <a-button size="small" @click="handleRedo"><RedoOutlined /></a-button>
                </a-space>
                <a-space class="toolbar-right">
                  <a-button size="small" @click="toggleSolutionFullscreen"><FullscreenOutlined /></a-button>
                  <a-button size="small" @click="toggleSolutionGrid"><AppstoreOutlined /></a-button>
                  <a-button size="small" @click="toggleSolutionPreview"><EyeOutlined /></a-button>
                  <a-button size="small" @click="toggleSolutionCode"><CodeOutlined /></a-button>
                  <a-button size="small" @click="toggleSolutionMenu"><MenuOutlined /></a-button>
                </a-space>
              </div>
              <div class="editor-content">
                <div class="editor-input">
                  <a-textarea
                    v-model:value="solutionContent"
                    :auto-size="{ minRows: 18, maxRows: 25 }"
                    placeholder="请输入题解内容（支持Markdown格式）"
                  />
                  <div class="word-count">字数: {{ solutionContent.length }}</div>
                </div>
                <div class="editor-preview" v-if="showSolutionPreview">
                  <div class="preview-content">
                    <!-- 预览内容 -->
                  </div>
                </div>
              </div>
              <div class="editor-footer">
                <span class="sync-scroll-label">同步滚动</span>
                <a-checkbox v-model:checked="solutionSyncScroll" />
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="solution-actions">
              <a-button type="primary" @click="handleSaveSolution">保存</a-button>
              <a-button @click="handleCancelSolution">取消</a-button>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  BoldOutlined,
  UnderlineOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  CodeOutlined,
  PictureOutlined,
  LinkOutlined,
  FileImageOutlined,
  TableOutlined,
  UploadOutlined,
  CloudUploadOutlined,
  FullscreenOutlined,
  EyeOutlined,
  CameraOutlined,
  CodeSandboxOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  UndoOutlined,
  RedoOutlined,
  CheckSquareOutlined,
  MinusOutlined,
  BarChartOutlined,
  FunctionOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue'
import { mockTags, mockProblemBanks } from '../mock/data'

const router = useRouter()
const route = useRoute()

// 题库信息
const bankId = ref(route.params.id as string)
const bankName = ref('')

// 预览中的提示文本
const selectHintText = '{{ select(1) }}'

// 答案模板
const answerTemplate = `type: objective # 表明该题为客观题
answers: # 列举出每一题的正确选项与对应的得分，总分需为100分
  '1': ['B', 2]`

onMounted(() => {
  const bank = mockProblemBanks.find((b) => b.id === bankId.value)
  if (bank) {
    bankName.value = bank.name
  }
})

// 当前Tab
const activeTab = ref('config')

// 题解上传相关
const solutionTitle = ref('')
const solutionContent = ref('')
const syncPublishAcademic = ref(true)
const showSolutionPreview = ref(true)
const solutionSyncScroll = ref(true)

const insertSolutionFormat = (type: string) => {
  message.info(`插入${type}格式（原型展示）`)
}

const handleUndo = () => {
  message.info('撤销（原型展示）')
}

const handleRedo = () => {
  message.info('重做（原型展示）')
}

const toggleSolutionFullscreen = () => {
  message.info('切换全屏模式（原型展示）')
}

const toggleSolutionGrid = () => {
  message.info('切换网格模式（原型展示）')
}

const toggleSolutionPreview = () => {
  showSolutionPreview.value = !showSolutionPreview.value
}

const toggleSolutionCode = () => {
  message.info('切换代码模式（原型展示）')
}

const toggleSolutionMenu = () => {
  message.info('切换菜单（原型展示）')
}

const handleSaveSolution = () => {
  if (!solutionTitle.value) {
    message.warning('请输入题解标题')
    return
  }
  if (!solutionContent.value) {
    message.warning('请输入题解内容')
    return
  }
  message.success('题解保存成功（原型展示）')
}

const handleCancelSolution = () => {
  solutionTitle.value = ''
  solutionContent.value = ''
  activeTab.value = 'config'
}

// 表单数据
const formData = reactive({
  title: '',
  content: `# <center>客观题试卷</center>

## 一、单选题（每题 2 分，共 30 分）

1、以下哪个编码不能表示数字  0
{{ select(1) }}
- $[00000000]_反$
- $[11111111]_反$
- $[10000000]_补$
- $[10000000]_原$`,
  permission: 'private',
  difficulty: '',
  tags: [] as string[],
  showAnswer: false,
})

// 预览相关
const showPreview = ref(true)
const syncScroll = ref(true)

// 难度列表
const difficulties = ['入门', '普及', '提高', '省选', 'NOI']

// 标签选项
const tagOptions = computed(() =>
  mockTags.map((tag) => ({ label: tag.name, value: tag.id }))
)

// 插入格式
const insertFormat = (type: string) => {
  message.info(`插入${type}格式（原型展示）`)
}

// 切换全屏
const toggleFullscreen = () => {
  message.info('切换全屏模式（原型展示）')
}

// 切换预览
const togglePreview = () => {
  showPreview.value = !showPreview.value
}

// 从其他题目复制
const handleCopyFromOther = () => {
  message.info('从其他题目复制（原型展示）')
}

// 保存
const handleSave = () => {
  if (!formData.title) {
    message.error('请输入标题')
    return
  }
  if (!formData.difficulty) {
    message.error('请选择难度')
    return
  }
  message.success('客观题创建成功（原型展示）')
  router.back()
}

// 取消
const handleCancel = () => {
  router.back()
}
</script>


<style scoped>
.create-objective {
  padding: 40px 24px;
  background: #f5f5f5;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-box {
  width: 100%;
  max-width: 1100px;
  background: #fff;
  border-radius: 8px;
  padding: 32px 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.breadcrumb-area {
  width: 100%;
  max-width: 1100px;
  margin-bottom: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.problem-form {
  width: 100%;
}

.problem-form :deep(.ant-form-item-label > label) {
  font-weight: 500;
}

.markdown-editor {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #fafafa;
  border-bottom: 1px solid #d9d9d9;
  flex-wrap: wrap;
  gap: 4px;
}

.editor-content {
  display: flex;
  min-height: 280px;
}

.editor-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #d9d9d9;
}

.editor-input :deep(.ant-input) {
  border: none;
  border-radius: 0;
  resize: none;
  flex: 1;
}

.word-count {
  padding: 4px 12px;
  font-size: 12px;
  color: #999;
  border-top: 1px solid #f0f0f0;
}

.editor-preview {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #fff;
}

.preview-content .preview-title {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.preview-content h4 {
  margin: 16px 0 12px;
  font-weight: 600;
  font-size: 14px;
}

.question-item p {
  margin: 8px 0;
  font-size: 14px;
}

.question-item .select-hint {
  color: #999;
  font-size: 12px;
}

.question-item ul {
  list-style: disc;
  padding-left: 24px;
  margin: 8px 0;
}

.question-item li {
  margin: 4px 0;
  font-size: 14px;
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  padding: 8px 12px;
  background: #fafafa;
  border-top: 1px solid #d9d9d9;
}

.answer-box {
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 12px 16px;
}

.answer-box pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  color: #333;
}

.switch-with-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.switch-text {
  color: #999;
  font-size: 14px;
}

/* 题解上传样式 */
.solution-upload {
  padding: 24px 0;
}

.solution-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.required-label {
  color: #ff4d4f;
  font-weight: 500;
  white-space: nowrap;
}

.solution-title-input {
  flex: 1;
  max-width: 500px;
}

.char-count {
  color: #999;
  font-size: 12px;
  white-space: nowrap;
}

.sync-checkbox {
  margin-left: auto;
}

.solution-editor {
  margin-bottom: 24px;
}

.solution-editor .editor-toolbar :deep(.ant-divider) {
  margin: 0 4px;
  height: 20px;
}

.solution-actions {
  display: flex;
  gap: 12px;
}

.sync-scroll-label {
  margin-right: 8px;
  color: #666;
  font-size: 13px;
}
</style>
