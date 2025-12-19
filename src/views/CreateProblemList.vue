<template>
  <div class="create-problem-list">
    <div class="content-box">
      <div class="page-header">
        <h2>创建题单</h2>
        <a-button type="link" @click="handleCopyFromOther">从其他题单复制</a-button>
      </div>

      <a-form :model="formData" layout="vertical" class="form-content">
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
                <a-button size="small"><BoldOutlined /></a-button>
                <a-button size="small"><UnderlineOutlined /></a-button>
                <a-button size="small"><ItalicOutlined /></a-button>
                <a-divider type="vertical" />
                <a-button size="small"><StrikethroughOutlined /></a-button>
                <a-button size="small">H</a-button>
                <a-button size="small">x₂</a-button>
                <a-button size="small">x²</a-button>
                <a-button size="small"><MenuOutlined /></a-button>
                <a-divider type="vertical" />
                <a-button size="small"><UnorderedListOutlined /></a-button>
                <a-button size="small"><OrderedListOutlined /></a-button>
                <a-divider type="vertical" />
                <a-button size="small"><CodeOutlined /></a-button>
                <a-button size="small"><PictureOutlined /></a-button>
                <a-button size="small"><LinkOutlined /></a-button>
                <a-button size="small"><FileImageOutlined /></a-button>
                <a-button size="small">Ω</a-button>
                <a-button size="small"><TableOutlined /></a-button>
                <a-button size="small"><UploadOutlined /></a-button>
                <a-button size="small"><CloudUploadOutlined /></a-button>
                <a-divider type="vertical" />
                <a-button size="small"><UndoOutlined /></a-button>
                <a-button size="small"><RedoOutlined /></a-button>
              </a-space>
              <a-space class="toolbar-right">
                <a-button size="small"><FullscreenOutlined /></a-button>
                <a-button size="small"><ExpandOutlined /></a-button>
                <a-button size="small"><EyeOutlined /></a-button>
                <a-button size="small"><SmileOutlined /></a-button>
                <a-button size="small"><CodeSandboxOutlined /></a-button>
                <a-button size="small"><MenuUnfoldOutlined /></a-button>
              </a-space>
            </div>
            <div class="editor-content">
              <div class="editor-input">
                <a-textarea
                  v-model:value="formData.description"
                  :auto-size="{ minRows: 15, maxRows: 25 }"
                  placeholder="请输入题单描述（支持Markdown格式）"
                />
              </div>
              <div class="editor-preview">
                <div class="preview-content"></div>
              </div>
            </div>
            <div class="editor-footer">
              <span class="word-count">字数: {{ formData.description.length }}</span>
              <a-checkbox v-model:checked="syncScroll">同步滚动</a-checkbox>
            </div>
          </div>
        </a-form-item>

        <!-- 题单权限、语言列表、IO模式 -->
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="题单权限">
              <a-select v-model:value="formData.permission" style="width: 100%">
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
              <a-select v-model:value="formData.ioMode" style="width: 100%">
                <a-select-option value="standard">标准IO</a-select-option>
                <a-select-option value="file">文件IO</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 开关选项 -->
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="是否需要重新作答">
              <a-switch v-model:checked="formData.needRetry" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="是否展示题目难度信息">
              <a-switch v-model:checked="formData.showDifficulty" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="是否展示题目标签">
              <a-switch v-model:checked="formData.showTags" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="是否在客观题提交后显示答案">
              <a-switch v-model:checked="formData.showObjectiveAnswer" checked-children="是" un-checked-children="否" />
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
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
  ExpandOutlined,
  EyeOutlined,
  SmileOutlined,
  CodeSandboxOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const syncScroll = ref(true)

const formData = reactive({
  title: '',
  subtitle: '',
  description: '',
  permission: 'private',
  languages: ['cpp14', 'cpp17', 'python3'],
  ioMode: 'standard',
  needRetry: false,
  showDifficulty: false,
  showTags: false,
  showObjectiveAnswer: false,
})

const handleCopyFromOther = () => {
  message.info('从其他题单复制（原型展示）')
}

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

.form-content :deep(.ant-form-item-label > label) {
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

.editor-preview {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background: #fff;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #fafafa;
  border-top: 1px solid #d9d9d9;
}

.word-count {
  font-size: 12px;
  color: #999;
}
</style>
