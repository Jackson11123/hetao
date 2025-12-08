<template>
  <div class="create-announcement">
    <div class="content-box">
      <div class="page-header">
        <h2>创建比赛公告</h2>
      </div>

      <a-form :model="formData" layout="vertical" class="form-content">
        <a-form-item label="标题" required>
          <a-input v-model:value="formData.title" placeholder="请输入标题" />
        </a-form-item>

        <a-form-item label="描述" required>
          <a-input v-model:value="formData.description" placeholder="请输入描述" />
        </a-form-item>

        <a-form-item label="头图">
          <a-upload :show-upload-list="false" :before-upload="handleBeforeUpload">
            <a-button>
              <template #icon><UploadOutlined /></template>
              上传头图
            </a-button>
          </a-upload>
          <div v-if="formData.coverUrl" class="cover-preview">
            <img :src="formData.coverUrl" alt="头图预览" />
          </div>
        </a-form-item>

        <a-form-item label="是否置顶">
          <a-switch v-model:checked="formData.isTop" checked-children="是" un-checked-children="否" />
        </a-form-item>

        <a-form-item label="内容" required>
          <div class="markdown-editor">
            <div class="editor-toolbar">
              <a-space>
                <a-button size="small"><BoldOutlined /></a-button>
                <a-button size="small"><UnderlineOutlined /></a-button>
                <a-button size="small"><ItalicOutlined /></a-button>
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
                <a-button size="small"><TableOutlined /></a-button>
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
              </div>
              <div class="editor-preview">
                <div class="preview-content"></div>
              </div>
            </div>
            <div class="editor-footer">
              <span class="word-count">字数: {{ formData.content.length }}</span>
              <a-checkbox v-model:checked="syncScroll">同步滚动</a-checkbox>
            </div>
          </div>
        </a-form-item>

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
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  UploadOutlined,
  BoldOutlined,
  UnderlineOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  CodeOutlined,
  PictureOutlined,
  LinkOutlined,
  TableOutlined,
  CloudUploadOutlined,
  FullscreenOutlined,
  ExpandOutlined,
  EyeOutlined,
  SmileOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  UndoOutlined,
  RedoOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const contestId = ref(route.params.id as string)
const syncScroll = ref(true)

const formData = reactive({
  title: '',
  description: '',
  coverUrl: '',
  isTop: false,
  content: ''
})

const handleBeforeUpload = () => {
  message.info('上传头图（原型展示）')
  return false
}

const handleSave = () => {
  if (!formData.title) {
    message.error('请输入标题')
    return
  }
  if (!formData.description) {
    message.error('请输入描述')
    return
  }
  if (!formData.content) {
    message.error('请输入内容')
    return
  }
  message.success('公告创建成功（原型展示）')
  router.push({ name: 'ContestDetail', params: { id: contestId.value }, query: { tab: 'announcements' } })
}

const handleCancel = () => {
  router.push({ name: 'ContestDetail', params: { id: contestId.value }, query: { tab: 'announcements' } })
}
</script>

<style scoped>
.create-announcement {
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

.cover-preview {
  margin-top: 8px;
}

.cover-preview img {
  max-width: 200px;
  max-height: 120px;
  border-radius: 4px;
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
  min-height: 250px;
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
