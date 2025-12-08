<template>
  <div class="task-management">
    <div class="page-header">
      <h2>任务管理</h2>
    </div>

    <!-- Tab切换 -->
    <div class="tab-area">
      <a-button :type="activeTab === 'normal' ? 'primary' : 'default'" @click="activeTab = 'normal'">普通任务</a-button>
      <a-button :type="activeTab === 'guzi' ? 'primary' : 'default'" @click="activeTab = 'guzi'">抽谷子任务</a-button>
      <a-button :type="activeTab === 'manual' ? 'primary' : 'default'" @click="activeTab = 'manual'">手动上传用户ID</a-button>
      <div class="tab-right">
        <a @click="handleCreateTask">创建任务</a>
      </div>
    </div>

    <!-- 普通任务 -->
    <div v-if="activeTab === 'normal'" class="tab-content">
      <h3>普通任务</h3>
      <div class="table-area">
        <a-table :columns="normalColumns" :data-source="normalTasks" :pagination="normalPagination" row-key="id" :scroll="{ x: 1400 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
            </template>
            <template v-else-if="column.key === 'enabled'">
              <a-tag :color="record.enabled ? 'green' : 'default'">{{ record.enabled ? '启用' : '停用' }}</a-tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="handleView(record)">查看</a>
                <a @click="handleEdit(record)">编辑</a>
                <a @click="handleToggleStatus(record)">{{ record.enabled ? '停用' : '启用' }}</a>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 抽谷子任务 -->
    <div v-if="activeTab === 'guzi'" class="tab-content">
      <h3>抽谷子任务</h3>
      <div class="table-area">
        <a-table :columns="guziColumns" :data-source="guziTasks" :pagination="guziPagination" row-key="id" :scroll="{ x: 1400 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
            </template>
            <template v-else-if="column.key === 'enabled'">
              <a-tag :color="record.enabled ? 'green' : 'default'">{{ record.enabled ? '启用' : '停用' }}</a-tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="handleView(record)">查看</a>
                <a @click="handleEdit(record)">编辑</a>
                <a @click="handleToggleStatus(record)">{{ record.enabled ? '停用' : '启用' }}</a>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 手动上传用户ID -->
    <div v-if="activeTab === 'manual'" class="tab-content manual-content">
      <h3>手动上传用户ID-通过用户ID直接发送奖励</h3>
      <a-form layout="vertical" class="manual-form">
        <a-form-item label="奖励ID" required>
          <a-input v-model:value="manualForm.rewardId" placeholder="请输入奖励ID" />
        </a-form-item>
        <a-form-item label="用户ID" required>
          <a-textarea v-model:value="manualForm.userIds" :rows="6" placeholder="请输入用户ID" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSendReward">发送奖励</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()
const activeTab = ref('normal')

// 普通任务数据
const normalTasks = ref([
  { id: '22468326729600', name: '新手引导任务', condition: '新手引导首次AC题目', status: '进行中', enabled: true, period: '2025-08-06~2039-08-31', repeatType: '执行一次', isNew: false, creator: '大路', createdAt: '2025-08-07 16:52:55' },
  { id: '22458329248704', name: '新手挑战任务', condition: '完成题单', status: '进行中', enabled: true, period: '2025-08-06~2039-08-31', repeatType: '执行一次', isNew: false, creator: '大路', createdAt: '2025-08-07 16:54:54' },
  { id: '22458329047936', name: '完善信息', condition: '完善信息', status: '进行中', enabled: true, period: '2025-08-06~2039-08-31', repeatType: '执行一次', isNew: false, creator: '大路', createdAt: '2025-08-07 16:55:56' },
  { id: '22338879217536', name: 'C++语法入门', condition: '语法入门', status: '进行中', enabled: true, period: '2025-04-14~2042-04-19', repeatType: '执行一次', isNew: false, creator: '常宫倩', createdAt: '2025-04-21 16:42:18' },
  { id: '22338881901568', name: 'CSP-J', condition: 'CSP-J', status: '进行中', enabled: true, period: '2025-04-14~2044-04-15', repeatType: '执行一次', isNew: false, creator: '常宫倩', createdAt: '2025-04-21 16:45:48' },
  { id: '22456815330304', name: '新手挑战任务', condition: '完成题单', status: '进行中', enabled: false, period: '2025-08-06~2039-08-31', repeatType: '执行一次', isNew: false, creator: '核桃OJ/理万小助理', createdAt: '2025-09-05 10:22:52' },
  { id: '22338869310976', name: '新手引导任务', condition: 'AC新手引导题目', status: '进行中', enabled: true, period: '2025-04-14~2035-04-14', repeatType: '执行一次', isNew: false, creator: '常宫倩', createdAt: '2025-04-21 16:29:24' }
])

const normalColumns = [
  { title: '任务ID', dataIndex: 'id', key: 'id', width: 140 },
  { title: '任务名称', dataIndex: 'name', key: 'name', width: 120 },
  { title: '任务达成条件', dataIndex: 'condition', key: 'condition', width: 150 },
  { title: '当前状态', key: 'status', width: 80 },
  { title: '是否启用', key: 'enabled', width: 80 },
  { title: '任务周期', dataIndex: 'period', key: 'period', width: 180 },
  { title: '重复方式', dataIndex: 'repeatType', key: 'repeatType', width: 80 },
  { title: '新版', dataIndex: 'isNew', key: 'isNew', width: 60 },
  { title: '创建人', dataIndex: 'creator', key: 'creator', width: 120 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
  { title: '操作', key: 'action', width: 150, fixed: 'right' as const }
]

const normalPagination = reactive({ current: 1, pageSize: 20, total: 10, showTotal: (total: number) => `共 ${total} 条` })

// 抽谷子任务数据
const guziTasks = ref([
  { id: '22490487434624', type: '谷子', name: '小米·西游 第二弹', condition: 'AC题目', status: '已结束', enabled: true, period: '2025-09-20~2025-10-04', creator: '核桃OJ/理万小助理', createdAt: '2025-09-05 18:58:46' },
  { id: '22490474793728', type: '谷子', name: '小米·西游 第一弹', condition: 'AC题目', status: '已结束', enabled: true, period: '2025-09-06~2025-09-20', creator: '核桃OJ/理万小助理', createdAt: '2025-09-05 18:32:23' },
  { id: '22459206740608', type: '谷子', name: '小米·三国演义第二弹', condition: 'AC题目', status: '已结束', enabled: true, period: '2025-08-09~2025-08-23', creator: '核桃OJ/理万小助理', createdAt: '2025-09-08 11:58:46' },
  { id: '22443842616192', type: '谷子', name: '小米·三国演义第二弹', condition: 'AC题目', status: '已结束', enabled: true, period: '2025-07-26~2025-08-09', creator: '核桃OJ/理万小助理', createdAt: '2025-07-25 14:33:24' },
  { id: '22428728875904', type: '谷子', name: '小米·三国演义第一弹', condition: 'AC题目', status: '已结束', enabled: true, period: '2025-07-12~2025-07-26', creator: '核桃OJ/理万小助理', createdAt: '2025-07-11 22:34:03' },
  { id: '22380837379200', type: '粽子', name: '2025端午活动', condition: 'AC题目', status: '已结束', enabled: true, period: '2025-05-29~2025-06-03', creator: '童子明朗', createdAt: '2025-05-29 15:15:20' },
  { id: '22365588868096', type: '谷子', name: '小米科学家第一弹', condition: '题目AC', status: '已结束', enabled: true, period: '2025-05-10~2025-05-29', creator: '核桃OJ/理万小助理', createdAt: '2025-05-08 18:02:35' }
])

const guziColumns = [
  { title: '任务ID', dataIndex: 'id', key: 'id', width: 140 },
  { title: '任务类型', dataIndex: 'type', key: 'type', width: 80 },
  { title: '任务名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: '任务达成条件', dataIndex: 'condition', key: 'condition', width: 100 },
  { title: '当前状态', key: 'status', width: 80 },
  { title: '是否启用', key: 'enabled', width: 80 },
  { title: '任务周期', dataIndex: 'period', key: 'period', width: 180 },
  { title: '创建人', dataIndex: 'creator', key: 'creator', width: 140 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
  { title: '操作', key: 'action', width: 150, fixed: 'right' as const }
]

const guziPagination = reactive({ current: 1, pageSize: 20, total: 12, showTotal: (total: number) => `共 ${total} 条` })

// 手动上传表单
const manualForm = reactive({ rewardId: '', userIds: '' })

const getStatusColor = (status: string) => {
  if (status === '进行中') return 'green'
  if (status === '已结束') return 'default'
  return 'blue'
}

const handleCreateTask = () => {
  if (activeTab.value === 'normal') {
    router.push({ name: 'CreateNormalTask' })
  } else if (activeTab.value === 'guzi') {
    router.push({ name: 'CreateGuziTask' })
  }
}

const handleView = (record: any) => {
  message.info(`查看任务: ${record.name}（原型展示）`)
}

const handleEdit = (record: any) => {
  message.info(`编辑任务: ${record.name}（原型展示）`)
}

const handleToggleStatus = (record: any) => {
  record.enabled = !record.enabled
  message.success(`任务已${record.enabled ? '启用' : '停用'}`)
}

const handleSendReward = () => {
  if (!manualForm.rewardId) {
    message.error('请输入奖励ID')
    return
  }
  if (!manualForm.userIds) {
    message.error('请输入用户ID')
    return
  }
  message.success('奖励发送成功（原型展示）')
}
</script>

<style scoped>
.task-management { padding: 24px; }
.page-header { margin-bottom: 16px; }
.page-header h2 { margin: 0; }
.tab-area { display: flex; gap: 8px; margin-bottom: 16px; align-items: center; }
.tab-right { margin-left: auto; }
.tab-content { background: #fff; padding: 16px; border-radius: 4px; }
.tab-content h3 { margin: 0 0 16px 0; }
.table-area { border: 1px solid #f0f0f0; border-radius: 4px; }
.manual-content { max-width: 800px; }
.manual-form { margin-top: 16px; }
</style>
