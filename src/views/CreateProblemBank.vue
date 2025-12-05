<template>
  <div class="create-problem-bank">
    <div class="content-box">
      <div class="page-header">
        <h2>创建题库</h2>
      </div>

      <a-form :model="formData" layout="vertical" class="form-content">
        <!-- 题库标题 -->
        <a-form-item label="题库标题" required>
          <a-input v-model:value="formData.title" placeholder="请输入题库标题" />
        </a-form-item>

        <!-- 题库权限 -->
        <a-form-item label="题库权限">
          <a-select v-model:value="formData.permission" style="width: 200px">
            <a-select-option value="private">私密题库</a-select-option>
            <a-select-option value="public">公开题库</a-select-option>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()

const formData = reactive({
  title: '',
  permission: 'private',
})

const handleSave = () => {
  if (!formData.title) {
    message.error('请输入题库标题')
    return
  }
  message.success('题库创建成功（原型展示）')
  router.back()
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.create-problem-bank {
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
</style>
