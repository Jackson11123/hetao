<template>
  <div class="group-info">
    <div class="info-header">
      <h3>查看小组</h3>
      <a-button type="primary" @click="handleEdit">编辑</a-button>
    </div>

    <div class="info-form">
      <a-form layout="vertical" :disabled="!isEditing">
        <a-form-item label="小组标题" required>
          <a-input v-model:value="formData.name" placeholder="请输入小组标题" />
        </a-form-item>

        <a-form-item label="小组描述" required>
          <a-textarea
            v-model:value="formData.description"
            :rows="6"
            placeholder="请输入小组描述"
          />
          <div class="word-count">字数: {{ formData.description?.length || 0 }}</div>
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="小组权限">
              <div class="permission-row">
                <a-select v-model:value="formData.permission" style="width: 160px">
                  <a-select-option value="需管理员审核加入">需管理员审核加入</a-select-option>
                  <a-select-option value="允许任何人加入">允许任何人加入</a-select-option>
                  <a-select-option value="禁止加入">禁止加入</a-select-option>
                </a-select>
                <a-button type="link" @click="handleCopy">
                  <template #icon><CopyOutlined /></template>
                  复制
                </a-button>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="小组类型" required>
              <a-select v-model:value="formData.type" style="width: 160px">
                <a-select-option value="to B/to G小组">to B/to G小组</a-select-option>
                <a-select-option value="内部小组">内部小组</a-select-option>
                <a-select-option value="外部小组">外部小组</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="所属学校">
              <a-input v-model:value="formData.school" placeholder="请输入学校" />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="所在省">
              <a-input v-model:value="formData.province" placeholder="省份" />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="所在市">
              <a-input v-model:value="formData.city" placeholder="城市" />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="是否前300">
              <a-select v-model:value="formData.isTop300">
                <a-select-option :value="true">是</a-select-option>
                <a-select-option :value="false">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="学校排名">
              <a-input v-model:value="formData.schoolRank" placeholder="排名" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item v-if="isEditing">
          <a-space>
            <a-button type="primary" @click="handleSave">保存</a-button>
            <a-button @click="handleCancel">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { CopyOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface GroupData {
  id: string
  name: string
  description: string
  type: string
  permission: string
  school: string
  province: string
  city: string
  isTop300: boolean
  schoolRank: string
}

const props = defineProps<{
  group: GroupData
}>()

const emit = defineEmits<{
  update: [data: GroupData]
}>()

const isEditing = ref(false)
const formData = reactive<GroupData>({
  id: '',
  name: '',
  description: '',
  type: '',
  permission: '',
  school: '',
  province: '',
  city: '',
  isTop300: false,
  schoolRank: '',
})

watch(
  () => props.group,
  (newVal) => {
    Object.assign(formData, newVal)
  },
  { immediate: true, deep: true }
)

const handleEdit = () => {
  isEditing.value = true
}

const handleSave = () => {
  emit('update', { ...formData })
  isEditing.value = false
  message.success('保存成功（原型展示）')
}

const handleCancel = () => {
  Object.assign(formData, props.group)
  isEditing.value = false
}

const handleCopy = () => {
  message.success('已复制加入链接（原型展示）')
}
</script>

<style scoped>
.group-info {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.info-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.info-form :deep(.ant-form-item-label > label) {
  font-weight: 500;
}

.word-count {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.permission-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
