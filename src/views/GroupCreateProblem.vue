<template>
  <div class="create-problem">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-area">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <router-link to="/groups">小组管理</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link :to="`/groups/${groupId}`">{{ groupName }}</router-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="content-box">
      <div class="page-header">
        <h2>创建OJ题</h2>
        <a-button type="link" @click="handleCopyFromOther">从其他题目复制</a-button>
      </div>

      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="config" tab="题目配置">
          <a-form :model="formData" layout="vertical" class="problem-form">
            <!-- 标题 -->
            <a-form-item label="标题" required>
              <a-input v-model:value="formData.title" placeholder="请输入标题" />
            </a-form-item>

            <!-- 题目描述 -->
            <a-form-item label="题目描述" required>
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
                      v-model:value="formData.description"
                      :auto-size="{ minRows: 15, maxRows: 25 }"
                      placeholder="请输入题目描述（支持Markdown格式）"
                    />
                    <div class="word-count">字数: {{ formData.description.length }}</div>
                  </div>
                  <div class="editor-preview" v-if="showPreview">
                    <div class="preview-content">
                      <h4>题目背景</h4>
                      <h4>题目描述</h4>
                      <h4>输出格式</h4>
                      <div class="sample-boxes">
                        <div class="sample-box">
                          <div class="sample-header">
                            <span class="dots"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></span>
                            <span>input1</span>
                            <a-button type="link" size="small">复制</a-button>
                          </div>
                          <div class="sample-content"></div>
                        </div>
                        <div class="sample-box">
                          <div class="sample-header">
                            <span class="dots"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></span>
                            <span>output1</span>
                            <a-button type="link" size="small">复制</a-button>
                          </div>
                          <div class="sample-content"></div>
                        </div>
                      </div>
                      <h4>样例解释</h4>
                      <h4>数据规模与约定</h4>
                      <h4>下发样例</h4>
                    </div>
                  </div>
                </div>
                <div class="editor-footer">
                  <a-checkbox v-model:checked="syncScroll">同步滚动</a-checkbox>
                </div>
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

            <!-- 代码是否可分享 -->
            <a-form-item label="代码是否可分享">
              <a-switch v-model:checked="formData.codeShareable" />
            </a-form-item>

            <!-- 语言列表 -->
            <a-form-item label="语言列表" required>
              <a-checkbox-group v-model:value="formData.languages">
                <a-checkbox v-for="lang in availableLanguages" :key="lang.value" :value="lang.value">
                  {{ lang.label }}
                </a-checkbox>
              </a-checkbox-group>
            </a-form-item>

            <!-- 文件IO -->
            <a-form-item label="文件IO">
              <a-space>
                <span>输入文件</span>
                <a-input v-model:value="formData.inputFile" placeholder="case.in" style="width: 150px" />
                <span>输出文件</span>
                <a-input v-model:value="formData.outputFile" placeholder="case.out" style="width: 150px" />
              </a-space>
            </a-form-item>

            <!-- 题解权限 -->
            <a-form-item label="题解权限">
              <a-select v-model:value="formData.solutionPermission" style="width: 200px">
                <a-select-option value="all">所有人可查看</a-select-option>
                <a-select-option value="ac">AC后可查看</a-select-option>
                <a-select-option value="none">不可查看</a-select-option>
              </a-select>
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

        <a-tab-pane key="testcase" tab="数据点配置">
          <div class="testcase-config">
            <p>数据点配置功能开发中...</p>
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
} from '@ant-design/icons-vue'
import { mockTags, mockGroups } from '../mock/data'

const router = useRouter()
const route = useRoute()

// 小组信息
const groupId = ref(route.params.id as string)
const groupName = ref('')

onMounted(() => {
  const group = mockGroups.find((g) => g.id === groupId.value)
  if (group) {
    groupName.value = group.name
  }
})

// 当前Tab
const activeTab = ref('config')

// 表单数据
const formData = reactive({
  title: '',
  description: `### 题目背景

### 题目描述

### 输出格式
\`\`\`input1

\`\`\`

\`\`\`output1

\`\`\`

### 样例解释

### 数据规模与约定`,
  permission: 'private',
  difficulty: '',
  tags: [] as string[],
  codeShareable: false,
  languages: ['cpp14', 'cpp17', 'python3'],
  inputFile: 'case.in',
  outputFile: 'case.out',
  solutionPermission: 'all',
})

// 预览相关
const showPreview = ref(true)
const syncScroll = ref(true)

// 难度列表
const difficulties = ['入门', '普及', '提高', '省选', 'NOI']

// 标签选项
const tagOptions = computed(() => mockTags.map((tag) => ({ label: tag.name, value: tag.id })))

// 可用语言
const availableLanguages = [
  { label: 'C++14 With O2', value: 'cpp14' },
  { label: 'C++17 With O2', value: 'cpp17' },
  { label: 'Python3', value: 'python3' },
  { label: 'Java', value: 'java' },
  { label: 'C', value: 'c' },
]

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
  if (formData.languages.length === 0) {
    message.error('请至少选择一种语言')
    return
  }
  message.success('题目创建成功（原型展示）')
  router.back()
}

// 取消
const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.create-problem {
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
  min-height: 300px;
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
  padding: 12px;
  overflow-y: auto;
  background: #fff;
}

.preview-content h4 {
  margin: 16px 0 8px;
  font-weight: 500;
  font-size: 14px;
}

.preview-content h4:first-child {
  margin-top: 0;
}

.sample-boxes {
  display: flex;
  gap: 12px;
}

.sample-box {
  flex: 1;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.sample-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
  font-size: 12px;
}

.dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot.red {
  background: #ff5f56;
}
.dot.yellow {
  background: #ffbd2e;
}
.dot.green {
  background: #27c93f;
}

.sample-content {
  min-height: 50px;
  padding: 8px 10px;
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  padding: 8px 12px;
  background: #fafafa;
  border-top: 1px solid #d9d9d9;
}

.testcase-config {
  padding: 40px;
  text-align: center;
  color: #999;
}
</style>
