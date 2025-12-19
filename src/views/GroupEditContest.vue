<template>
  <div class="edit-contest">
    <div class="content-box">
      <div class="page-header">
        <h2>编辑比赛</h2>
      </div>
      <a-form :model="formData" layout="vertical" class="form-content">
        <a-form-item label="比赛标题" required>
          <a-input v-model:value="formData.title" placeholder="请输入比赛标题" />
        </a-form-item>
        <a-form-item label="比赛描述" required>
          <a-textarea v-model:value="formData.description" :rows="6" placeholder="请输入比赛描述" />
        </a-form-item>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="开始时间" required>
              <a-date-picker v-model:value="formData.startTime" show-time style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="结束时间" required>
              <a-date-picker v-model:value="formData.endTime" show-time style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="比赛时长"><a-input v-model:value="formData.duration" disabled /></a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="比赛赛制" required>
              <a-select v-model:value="formData.format" style="width: 100%">
                <a-select-option value="OI">OI</a-select-option>
                <a-select-option value="ACM">ACM</a-select-option>
                <a-select-option value="乐多">乐多</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="IO模式">
              <a-select v-model:value="formData.ioMode" style="width: 100%">
                <a-select-option value="标准IO">标准IO</a-select-option>
                <a-select-option value="文件IO">文件IO</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="比赛权限">
              <a-select v-model:value="formData.permission" style="width: 100%">
                <a-select-option value="私密比赛">私密比赛</a-select-option>
                <a-select-option value="公开比赛">公开比赛</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="赛后是否允许提交">
              <a-switch v-model:checked="formData.allowPostSubmit" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否需要口令">
              <a-switch v-model:checked="formData.needPassword" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
        </a-row>
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
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const groupId = route.params.id as string

const formData = reactive({
  title: 'C++算法设计大赛初赛模拟卷1',
  description: '本次考试为 C++算法设计大赛模拟卷1',
  startTime: dayjs('2025-12-05 17:00'),
  endTime: dayjs('2026-03-31 00:00'),
  duration: '3月24日1小时',
  format: '乐多',
  ioMode: '标准IO',
  permission: '私密比赛',
  allowPostSubmit: true,
  needPassword: false
})

const handleSave = () => {
  if (!formData.title) { message.error('请输入比赛标题'); return }
  message.success('比赛保存成功（原型展示）')
  router.push({ name: 'GroupDetail', params: { id: groupId } })
}

const handleCancel = () => {
  router.push({ name: 'GroupDetail', params: { id: groupId } })
}
</script>

<style scoped>
.edit-contest { padding: 40px 24px; background: #f5f5f5; min-height: calc(100vh - 64px); display: flex; flex-direction: column; align-items: center; }
.content-box { width: 100%; max-width: 1100px; background: #fff; border-radius: 8px; padding: 32px 40px; }
.page-header { margin-bottom: 24px; }
.page-header h2 { margin: 0; font-size: 20px; }
</style>
