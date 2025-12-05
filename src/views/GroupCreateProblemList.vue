<template>
  <div class="create-problem-list">
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
        <h2>创建题单</h2>
        <a-button type="link" @click="handleCopyFromOther">从其他题单复制</a-button>
      </div>

      <a-form :model="formData" layout="vertical" class="problem-list-form">
        <!-- 题单标题 -->
        <a-form-item label="题单标题" required>
          <a-input v-model:value="formData.title" placeholder="请输入题单标题" />
        </a-form-item>

        <!-- 题单副标题 -->
        <a-form-item label="题单副标题" required>
          <a-input v-model:value="formData.subtitle" placeholder="请输入题单副标题" />
        </a-form-item>

        <!-- 题单描述 -->
        <a-form-item label="题单描述" required>
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
                <a-button size="small" @click="insertFormat('quote')">99</a-button>
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
                <a-button size="small" @click="insertFormat('undo')"><UndoOutlined /></a-button>
                <a-button size="small" @click="insertFormat('redo')"><RedoOutlined /></a-button>
              </a-space>
              <a-space class="toolbar-right">
                <a-button size="small" @click="toggleExpand"><ExpandOutlined /></a-button>
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
                  :auto-size="{ minRows: 12, maxRows: 20 }"
                  placeholder="请输入题单描述（支持Markdown格式）"
                />
                <div class="word-count">字数: {{ formData.description.length }}</div>
              </div>
              <div class="editor-preview" v-if="showPreview">
                <div class="preview-content"></div>
              </div>
            </div>
            <div class="editor-footer">
              <span></span>
              <a-checkbox v-model:checked="syncScroll">同步滚动</a-checkbox>
            </div>
          </div>
        </a-form-item>

        <!-- 题单权限、语言列表、IO模式 -->
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="题单权限">
              <a-select v-model:value="formData.permission" placeholder="请选择权限">
                <a-select-option value="private">私密题单</a-select-option>
                <a-select-option value="public">公开题单</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="语言列表">
              <a-checkbox-group v-model:value="formData.languages">
                <a-checkbox value="cpp14">C++14 With O2</a-checkbox>
                <a-checkbox value="cpp17">C++17 With O2</a-checkbox>
                <a-checkbox value="python3">Python3</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="IO模式">
              <a-select v-model:value="formData.ioMode" placeholder="请选择IO模式">
                <a-select-option value="standard">标准IO</a-select-option>
                <a-select-option value="file">文件IO</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 开关选项第一行 -->
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="是否向核桃OJ贡献">
              <div class="switch-with-text">
                <a-switch v-model:checked="formData.contributeToOJ" />
                <span class="switch-text">{{ formData.contributeToOJ ? '是' : '否' }}</span>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否需要重新作答">
              <div class="switch-with-text">
                <a-switch v-model:checked="formData.requireReanswer" />
                <span class="switch-text">{{ formData.requireReanswer ? '是' : '否' }}</span>
              </div>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 开关选项第二行 -->
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="是否展示题目难度信息">
              <div class="switch-with-text">
                <a-switch v-model:checked="formData.showDifficulty" />
                <span class="switch-text">{{ formData.showDifficulty ? '是' : '否' }}</span>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否展示题目标签">
              <div class="switch-with-text">
                <a-switch v-model:checked="formData.showTags" />
                <span class="switch-text">{{ formData.showTags ? '是' : '否' }}</span>
              </div>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 操作按钮 -->
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSave">保 存</a-button>
            <a-button @click="handleCancel">取 消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
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
  UndoOutlined,
  RedoOutlined,
  ExpandOutlined,
} from '@ant-design/icons-vue'
import { mockGroups } from '../mock/data'

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

// 表单数据
const formData = reactive({
  title: '',
  subtitle: '',
  description: '',
  permission: 'private',
  languages: [] as string[],
  ioMode: 'standard',
  contributeToOJ: true,
  requireReanswer: false,
  showDifficulty: false,
  showTags: false,
})

// 预览相关
const showPreview = ref(true)
const syncScroll = ref(true)

// 插入格式
const insertFormat = (type: string) => {
  message.info(`插入${type}格式（原型展示）`)
}

// 切换展开
const toggleExpand = () => {
  message.info('切换展开模式（原型展示）')
}

// 切换全屏
const toggleFullscreen = () => {
  message.info('切换全屏模式（原型展示）')
}

// 切换预览
const togglePreview = () => {
  showPreview.value = !showPreview.value
}

// 从其他题单复制
const handleCopyFromOther = () => {
  message.info('从其他题单复制（原型展示）')
}

// 保存
const handleSave = () => {
  if (!formData.title) {
    message.error('请输入题单标题')
    return
  }
  if (!formData.subtitle) {
    message.error('请输入题单副标题')
    return
  }
  message.success('题单创建成功（原型展示）')
  router.back()
}

// 取消
const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.create-problem-list {
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

.problem-list-form {
  width: 100%;
}

.problem-list-form :deep(.ant-form-item-label > label) {
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

.editor-footer {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #fafafa;
  border-top: 1px solid #d9d9d9;
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
</style>
