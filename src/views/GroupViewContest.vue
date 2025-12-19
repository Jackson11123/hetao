<template>
  <div class="view-contest">
    <div class="content-box">
      <div class="page-header">
        <h2>查看比赛</h2>
      </div>
      <a-form layout="vertical" class="form-content">
        <a-form-item label="比赛标题">
          <a-input :value="formData.title" disabled />
        </a-form-item>
        <a-form-item label="比赛描述">
          <a-textarea :value="formData.description" :rows="6" disabled />
        </a-form-item>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="开始时间">
              <a-input :value="formData.startTime" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="结束时间">
              <a-input :value="formData.endTime" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="比赛时长">
              <a-input :value="formData.duration" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="比赛赛制">
              <a-input :value="formData.format" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="IO模式">
              <a-input :value="formData.ioMode" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="比赛权限">
              <a-input :value="formData.permission" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="赛后是否允许提交">
              <a-switch :checked="formData.allowPostSubmit" disabled checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否需要口令">
              <a-switch :checked="formData.needPassword" disabled checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item>
          <a-button @click="handleBack">返 回</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const groupId = route.params.id as string

const formData = reactive({
  title: 'C++算法设计大赛初赛模拟卷1',
  description: '本次考试为 C++算法设计大赛模拟卷1',
  startTime: '2025-12-05 17:00',
  endTime: '2026-03-31 00:00',
  duration: '3月24日1小时',
  format: '乐多',
  ioMode: '标准IO',
  permission: '私密比赛',
  allowPostSubmit: true,
  needPassword: false
})

const handleBack = () => {
  router.push({ name: 'GroupDetail', params: { id: groupId } })
}
</script>

<style scoped>
.view-contest { padding: 40px 24px; background: #f5f5f5; min-height: calc(100vh - 64px); display: flex; flex-direction: column; align-items: center; }
.content-box { width: 100%; max-width: 1100px; background: #fff; border-radius: 8px; padding: 32px 40px; }
.page-header { margin-bottom: 24px; }
.page-header h2 { margin: 0; font-size: 20px; }
</style>
