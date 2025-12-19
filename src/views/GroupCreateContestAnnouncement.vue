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
          <a-button><UploadOutlined /> 上传头图</a-button>
        </a-form-item>
        <a-form-item label="是否置顶">
          <a-switch v-model:checked="formData.isTop" checked-children="是" un-checked-children="否" />
        </a-form-item>
        <a-form-item label="内容" required>
          <a-textarea v-model:value="formData.content" :rows="10" placeholder="请输入内容（支持Markdown格式）" />
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
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const groupId = route.params.id as string
const contestId = route.params.contestId as string

const formData = reactive({
  title: '',
  description: '',
  isTop: false,
  content: ''
})

const handleSave = () => {
  if (!formData.title) { message.error('请输入标题'); return }
  if (!formData.description) { message.error('请输入描述'); return }
  if (!formData.content) { message.error('请输入内容'); return }
  message.success('公告创建成功（原型展示）')
  router.push({ name: 'GroupContestDetail', params: { id: groupId, contestId }, query: { tab: 'announcements' } })
}

const handleCancel = () => {
  router.push({ name: 'GroupContestDetail', params: { id: groupId, contestId }, query: { tab: 'announcements' } })
}
</script>

<style scoped>
.create-announcement { padding: 40px 24px; background: #f5f5f5; min-height: calc(100vh - 64px); display: flex; flex-direction: column; align-items: center; }
.content-box { width: 100%; max-width: 900px; background: #fff; border-radius: 8px; padding: 32px 40px; }
.page-header { margin-bottom: 24px; }
.page-header h2 { margin: 0; font-size: 20px; }
</style>
