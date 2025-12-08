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
            <a-form-item label="是否送分裂">
              <a-switch v-model:checked="formData.sendSplit" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="完成任务后是否自动发奖">
              <a-switch v-model:checked="formData.autoReward" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="启用状态">
              <a-switch v-model:checked="formData.enabled" checked-children="启用" un-checked-children="停用" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否粉丝任务">
              <a-switch v-model:checked="formData.isFanTask" checked-children="关闭粉丝" un-checked-children="关闭粉丝" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="周期设置" required>
              <a-range-picker v-model:value="formData.period" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="重复设置">
              <a-select v-model:value="formData.repeatType" style="width: 100%">
                <a-select-option value="执行一次">执行一次</a-select-option>
                <a-select-option value="每日重复">每日重复</a-select-option>
                <a-select-option value="每周重复">每周重复</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="设置入群包">
              <a-input v-model:value="formData.groupPackage" placeholder="请输入入群包ID" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="达成则隐藏">
              <a-switch v-model:checked="formData.hideOnComplete" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24" align="middle">
          <a-col :span="4">
            <span>奖励设置</span>
          </a-col>
          <a-col :span="6">
            <a-button @click="handleSetReward">设置声望值</a-button>
          </a-col>
          <a-col :span="4">
            <span>声望值/次</span>
          </a-col>
          <a-col :span="10">
            <a-input v-model:value="formData.rewardId" placeholder="输入奖励数ID" />
          </a-col>
        </a-row>

        <a-row :gutter="24" style="margin-top: 16px;">
          <a-col :span="4">
            <span>达成条件</span>
          </a-col>
          <a-col :span="6">
            <a-select v-model:value="formData.conditionType" style="width: 100%">
              <a-select-option value="访问OJ平台">访问OJ平台</a-select-option>
              <a-select-option value="AC题目">AC题目</a-select-option>
              <a-select-option value="完成题单">完成题单</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="10">
            <a-input v-model:value="formData.conditionValue" placeholder="输入题目/题单/比赛ID，支持配置多项不填" />
          </a-col>
          <a-col :span="2">
            <span>设置次数</span>
          </a-col>
          <a-col :span="2">
            <a-input v-model:value="formData.conditionCount" placeholder="" suffix="次" />
          </a-col>
        </a-row>

        <a-form-item label="点完成按钮跳转链接" style="margin-top: 16px;">
          <a-input v-model:value="formData.jumpLink" placeholder="输入跳转链接" />
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
  sendSplit: true,
  autoReward: true,
  enabled: true,
  isFanTask: false,
  period: null as [Dayjs, Dayjs] | null,
  repeatType: '执行一次',
  groupPackage: '',
  hideOnComplete: false,
  rewardId: '',
  conditionType: '访问OJ平台',
  conditionValue: '',
  conditionCount: '',
  jumpLink: ''
})

const goBack = () => {
  router.push({ name: 'TaskManagement' })
}

const handleSetReward = () => {
  message.info('设置声望值（原型展示）')
}

const handleSave = () => {
  if (!formData.name) { message.error('请输入任务名称'); return }
  if (!formData.condition) { message.error('请输入任务达成条件'); return }
  if (!formData.period) { message.error('请选择周期'); return }
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
