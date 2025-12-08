<template>
  <div class="create-task">
    <div class="breadcrumb">
      <a @click="goBack">返回任务列表</a>
    </div>
    <div class="content-box">
      <h2>创建任务</h2>

      <a-form :model="formData" layout="vertical" class="form-content">
        <a-form-item label="任务名称" required>
          <a-input v-model:value="formData.name" placeholder="请输入任务名称" />
        </a-form-item>

        <a-form-item label="任务达成条件" required>
          <a-input v-model:value="formData.condition" placeholder="请输入任务达成条件" />
        </a-form-item>

        <a-form-item label="是否新手任务">
          <a-switch v-model:checked="formData.isNewbie" checked-children="是" un-checked-children="否" />
        </a-form-item>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="启用状态">
              <a-switch v-model:checked="formData.enabled" checked-children="启用" un-checked-children="停用" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="任务类型">
              <a-select v-model:value="formData.taskType" style="width: 100%">
                <a-select-option value="谷子">谷子</a-select-option>
                <a-select-option value="积分">积分</a-select-option>
                <a-select-option value="徽章">徽章</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="周期设置" required>
          <a-range-picker v-model:value="formData.period" style="width: 100%" />
        </a-form-item>

        <a-form-item label="奖励设置" required>
          <a-input v-model:value="formData.reward" placeholder="请输入奖励设置，可以使用英文逗号分隔多个奖励ID，第4个奖励ID可以配置为弹框奖励ID" />
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
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'

const router = useRouter()

const formData = reactive({
  name: '',
  condition: '',
  isNewbie: false,
  enabled: true,
  taskType: '谷子',
  period: null as [Dayjs, Dayjs] | null,
  reward: ''
})

const goBack = () => {
  router.push({ name: 'TaskManagement' })
}

const handleSave = () => {
  if (!formData.name) { message.error('请输入任务名称'); return }
  if (!formData.condition) { message.error('请输入任务达成条件'); return }
  if (!formData.period) { message.error('请选择周期'); return }
  if (!formData.reward) { message.error('请输入奖励设置'); return }
  message.success('任务创建成功（原型展示）')
  router.push({ name: 'TaskManagement' })
}

const handleCancel = () => {
  router.push({ name: 'TaskManagement' })
}
</script>

<style scoped>
.create-task { padding: 24px; background: #f5f5f5; min-height: calc(100vh - 64px); }
.breadcrumb { margin-bottom: 16px; }
.breadcrumb a { color: #666; cursor: pointer; }
.content-box { max-width: 900px; background: #fff; border-radius: 8px; padding: 32px 40px; }
.content-box h2 { margin: 0 0 24px 0; font-size: 20px; }
</style>
