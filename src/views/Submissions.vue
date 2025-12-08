<template>
  <div class="submissions">
    <div class="page-header">
      <h2>全部提交</h2>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <a-form layout="inline">
        <a-form-item label="提交ID">
          <a-input v-model:value="searchForm.submitId" placeholder="请输入" style="width: 100px" allow-clear />
        </a-form-item>
        <a-form-item label="用户ID">
          <a-input v-model:value="searchForm.userId" placeholder="请输入" style="width: 100px" allow-clear />
        </a-form-item>
        <a-form-item label="题目ID">
          <a-input v-model:value="searchForm.problemId" placeholder="请输入" style="width: 100px" allow-clear />
        </a-form-item>
        <a-form-item label="比赛ID">
          <a-input v-model:value="searchForm.contestId" placeholder="请输入" style="width: 100px" allow-clear />
        </a-form-item>
        <a-form-item label="题单ID">
          <a-input v-model:value="searchForm.problemListId" placeholder="请输入" style="width: 100px" allow-clear />
        </a-form-item>
        <a-form-item label="小组ID">
          <a-input v-model:value="searchForm.groupId" placeholder="请输入" style="width: 100px" allow-clear />
        </a-form-item>
        <a-form-item label="题库ID">
          <a-input v-model:value="searchForm.bankId" placeholder="请输入" style="width: 100px" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 提交表格 -->
    <div class="table-area">
      <a-table
        :columns="columns"
        :data-source="submissions"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 1800 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template v-if="column.key === 'isCheating'">
            <span :class="record.isCheating ? 'text-danger' : ''">{{ record.isCheating ? '是' : '否' }}</span>
          </template>
        </template>
        <template #emptyText>
          <div class="empty-content">
            <inbox-outlined style="font-size: 48px; color: #d9d9d9" />
            <p>暂无数据</p>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// 搜索表单
const searchForm = reactive({
  submitId: '',
  userId: '',
  problemId: '',
  contestId: '',
  problemListId: '',
  groupId: '',
  bankId: '',
})

// 表格列定义
const columns = [
  { title: '状态', key: 'status', width: 100 },
  { title: '题目编号', dataIndex: 'problemNo', key: 'problemNo', width: 100 },
  { title: '题目名称', dataIndex: 'problemName', key: 'problemName', width: 150 },
  { title: '用户PID', dataIndex: 'userPid', key: 'userPid', width: 100 },
  { title: '提交者', dataIndex: 'submitter', key: 'submitter', width: 100 },
  { title: '用时', dataIndex: 'time', key: 'time', width: 80 },
  { title: '内存', dataIndex: 'memory', key: 'memory', width: 80 },
  { title: '是否作弊', key: 'isCheating', width: 100 },
  { title: '语言', dataIndex: 'language', key: 'language', width: 100 },
  { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 160 },
  { title: '判题时间', dataIndex: 'judgeTime', key: 'judgeTime', width: 160 },
  { title: '题目ID', dataIndex: 'problemId', key: 'problemId', width: 100 },
  { title: '比赛ID', dataIndex: 'contestId', key: 'contestId', width: 100 },
  { title: '题单ID', dataIndex: 'problemListId', key: 'problemListId', width: 100 },
  { title: '小组ID', dataIndex: 'groupId', key: 'groupId', width: 100 },
  { title: '题库ID', dataIndex: 'bankId', key: 'bankId', width: 100 },
]

// 提交数据（空数据）
const submissions = ref<any[]>([])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 获取状态颜色
const getStatusColor = (status: string) => {
  switch (status) {
    case 'AC':
    case 'Accepted':
      return 'green'
    case 'WA':
    case 'Wrong Answer':
      return 'red'
    case 'TLE':
    case 'Time Limit Exceeded':
      return 'orange'
    case 'MLE':
    case 'Memory Limit Exceeded':
      return 'purple'
    case 'RE':
    case 'Runtime Error':
      return 'volcano'
    case 'CE':
    case 'Compile Error':
      return 'gold'
    case 'Pending':
      return 'blue'
    default:
      return 'default'
  }
}

// 搜索
const handleSearch = () => {
  message.info('搜索提交记录（原型展示）')
}
</script>

<style scoped>
.submissions {
  padding: 24px;
}

.page-header {
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
}

.search-area {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.search-area :deep(.ant-form-item) {
  margin-bottom: 8px;
}

.table-area {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.empty-content {
  padding: 40px 0;
  text-align: center;
  color: #999;
}

.empty-content p {
  margin-top: 16px;
}

.text-danger {
  color: #ff4d4f;
}
</style>
