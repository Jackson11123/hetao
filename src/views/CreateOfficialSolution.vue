<template>
  <div class="create-solution">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-area">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <router-link to="/problem-banks">题库</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link :to="`/problem-banks/${bankId}/problems/${problemId}/solutions`">{{ problemInfo }}</router-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="content-box">
      <div class="page-header">
        <h2>创建题解</h2>
      </div>

      <!-- 题解标题行 -->
      <div class="solution-title-row">
        <span class="required-label">* 题解标题</span>
        <a-input
          v-model:value="formData.title"
          placeholder="请输入标题"
          class="solution-title-input"
        />
        <a-checkbox v-model:checked="formData.isOfficial" class="official-checkbox">设置为官方题解</a-checkbox>
        <a-checkbox v-model:checked="formData.syncAcademic" class="sync-checkbox">同步发布学术版</a-checkbox>
      </div>

      <!-- Markdown编辑器 -->
      <div class="markdown-editor">
        <div class="editor-toolbar">
          <a-space>
            <a-button size="small"><BoldOutlined /></a-button>
            <a-button size="small"><UnderlineOutlined /></a-button>
            <a-button size="small"><ItalicOutlined /></a-button>
            <a-button size="small"><StrikethroughOutlined /></a-button>
            <a-divider type="vertical" />
            <a-button size="small">H<sub>1</sub></a-button>
            <a-button size="small">x<sub>2</sub></a-button>
            <a-button size="small">x<sup>2</sup></a-button>
            <a-button size="small" v-text="bracesText"></a-button>
            <a-divider type="vertical" />
            <a-button size="small"><OrderedListOutlined /></a-button>
            <a-button size="small"><UnorderedListOutlined /></a-button>
            <a-button size="small"><CheckSquareOutlined /></a-button>
            <a-divider type="vertical" />
            <a-button size="small">&lt;&gt;</a-button>
            <a-button size="small">&lt;/&gt;</a-button>
            <a-button size="small"><LinkOutlined /></a-button>
            <a-button size="small"><PictureOutlined /></a-button>
            <a-button size="small"><CloudUploadOutlined /></a-button>
            <a-divider type="vertical" />
            <a-button size="small"><TableOutlined /></a-button>
            <a-button size="small"><DesktopOutlined /></a-button>
            <a-button size="small"><FunctionOutlined /></a-button>
            <a-divider type="vertical" />
            <a-button size="small"><UndoOutlined /></a-button>
            <a-button size="small"><RedoOutlined /></a-button>
          </a-space>
          <a-space class="toolbar-right">
            <a-button size="small"><ExpandOutlined /></a-button>
            <a-button size="small"><SplitCellsOutlined /></a-button>
            <a-button size="small" @click="togglePreview"><EyeOutlined /></a-button>
            <a-button size="small"><SettingOutlined /></a-button>
            <a-button size="small"><CodeOutlined /></a-button>
            <a-button size="small"><MenuOutlined /></a-button>
          </a-space>
        </div>
        <div class="editor-content">
          <div class="editor-input">
            <a-textarea
              v-model:value="formData.content"
              :auto-size="{ minRows: 18, maxRows: 25 }"
              placeholder="请输入题解内容（支持Markdown格式）"
            />
            <div class="word-count">字数: {{ formData.content.length }}</div>
          </div>
          <div class="editor-preview" v-if="showPreview">
            <div class="preview-content">
              <h2 class="preview-title">客观题试卷</h2>
              <h3>一、单选题（每题 2 分，共 30 分）</h3>
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
          <span class="sync-scroll-label">同步滚动</span>
          <a-checkbox v-model:checked="syncScroll" />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <a-button type="primary" @click="handleSave">创建</a-button>
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  BoldOutlined,
  UnderlineOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  CheckSquareOutlined,
  LinkOutlined,
  PictureOutlined,
  CloudUploadOutlined,
  TableOutlined,
  DesktopOutlined,
  FunctionOutlined,
  UndoOutlined,
  RedoOutlined,
  ExpandOutlined,
  SplitCellsOutlined,
  EyeOutlined,
  SettingOutlined,
  CodeOutlined,
  MenuOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

const bankId = ref(route.params.bankId as string)
const problemId = ref(route.params.problemId as string)
const problemInfo = ref('')

// 模板中使用的文本常量
const selectHintText = '{{ select(1) }}'
const bracesText = '{}'

// 模拟题目名称映射
const problemNameMap: Record<string, string> = {
  P5315: '[GESP202412 一级] 温度转换',
  P1510C: '算法竞赛L21阶段测试客观题',
  P10781: 'L7-1 OJ题',
  P10568: 'BTY杯测题专用'
}

onMounted(() => {
  const problemName = problemNameMap[problemId.value] || '未知题目'
  problemInfo.value = `[${problemId.value}] ${problemName}`
})

// 表单数据
const formData = reactive({
  title: '',
  content: `# <center>客观题试卷</center>

## 一、单选题（每题 2 分，共 30 分）

1. 以下哪个编码不能表示数字 0
{{ select(1) }}
- $[00000000]_反$
- $[11111111]_反$
- $[10000000]_补$
- $[10000000]_原$`,
  syncAcademic: false,
  isOfficial: false,
})

// 预览相关
const showPreview = ref(true)
const syncScroll = ref(true)

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

// 保存
const handleSave = () => {
  if (!formData.title) {
    message.error('请输入题解标题')
    return
  }
  if (!formData.content) {
    message.error('请输入题解内容')
    return
  }
  message.success('官方题解创建成功（原型展示）')
  router.back()
}

// 取消
const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.create-solution {
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
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
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

.official-checkbox {
  margin-left: auto;
}

.sync-checkbox {
  margin-left: 16px;
}

.markdown-editor {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 24px;
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

.editor-toolbar :deep(.ant-divider) {
  margin: 0 4px;
  height: 20px;
}

.editor-content {
  display: flex;
  min-height: 400px;
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
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.preview-content h3 {
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
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
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
  align-items: center;
  padding: 8px 12px;
  background: #fafafa;
  border-top: 1px solid #d9d9d9;
}

.sync-scroll-label {
  margin-right: 8px;
  color: #666;
  font-size: 13px;
}

.form-actions {
  display: flex;
  gap: 12px;
}
</style>
