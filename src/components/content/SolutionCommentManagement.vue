<template>
  <div class="solution-comment-management">
    <div class="page-header"><h2>题解评论管理</h2></div>
    <div class="search-area">
      <a-form layout="inline">
        <a-form-item label="请输入题解ID"><a-input v-model:value="searchForm.solutionId" placeholder="" style="width: 120px" allow-clear /></a-form-item>
        <a-form-item label="请输入评论ID"><a-input v-model:value="searchForm.commentId" placeholder="" style="width: 120px" allow-clear /></a-form-item>
        <a-form-item label="请输入评论关键字"><a-input v-model:value="searchForm.keyword" placeholder="" style="width: 140px" allow-clear /></a-form-item>
        <a-form-item label="请选择举报状态">
          <a-select v-model:value="searchForm.reportStatus" placeholder="" style="width: 120px" allow-clear>
            <a-select-option value="">全部</a-select-option><a-select-option value="举报">举报</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="请选择评论状态">
          <a-select v-model:value="searchForm.commentStatus" placeholder="" style="width: 120px" allow-clear>
            <a-select-option value="">全部</a-select-option><a-select-option value="公开">公开</a-select-option><a-select-option value="管理删除">管理删除</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="开始时间"><a-date-picker v-model:value="searchForm.startTime" placeholder="" style="width: 140px" /></a-form-item>
        <a-form-item>—</a-form-item>
        <a-form-item label="结束时间"><a-date-picker v-model:value="searchForm.endTime" placeholder="" style="width: 140px" /></a-form-item>
        <a-form-item label="最后操作人UID"><a-input v-model:value="searchForm.operatorUid" placeholder="" style="width: 120px" allow-clear /></a-form-item>
        <a-form-item><a-button type="primary" @click="handleSearch">搜索</a-button></a-form-item>
      </a-form>
    </div>
    <div class="table-area">
      <a-table :columns="columns" :data-source="tableData" :pagination="pagination" row-key="id" :scroll="{ x: 1400 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'reportCount'"><span :class="record.reportCount > 0 ? 'text-warning' : ''">{{ record.reportCount }}</span></template>
          <template v-if="column.key === 'status'"><span :class="record.status === '管理删除' ? 'text-danger' : ''">{{ record.status }}</span><br/><span v-if="record.statusNote" class="status-note">{{ record.statusNote }}</span></template>
          <template v-if="column.key === 'action'"><a @click="handleManage(record)">管理</a></template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'

const searchForm = reactive({ solutionId: '', commentId: '', keyword: '', reportStatus: '', commentStatus: '', startTime: null as Dayjs | null, endTime: null as Dayjs | null, operatorUid: '' })
const pagination = reactive({ pageSize: 10, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` })
const columns = [
  { title: '讨论ID', dataIndex: 'discussionId', key: 'discussionId', width: 100 },
  { title: '发布者ID', dataIndex: 'publisherId', key: 'publisherId', width: 100 },
  { title: '发布者昵称', dataIndex: 'publisherName', key: 'publisherName', width: 120 },
  { title: '回复内容', dataIndex: 'content', key: 'content', width: 200, ellipsis: true },
  { title: '点赞数', dataIndex: 'likeCount', key: 'likeCount', width: 80 },
  { title: '评论数', dataIndex: 'commentCount', key: 'commentCount', width: 80 },
  { title: '被举报次数', key: 'reportCount', width: 100 },
  { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 160 },
  { title: '状态', key: 'status', width: 120 },
  { title: '最后操作人', dataIndex: 'lastOperator', key: 'lastOperator', width: 100 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
]

const tableData = ref([
  { id: '1', discussionId: '60087', publisherId: '47981764', publisherName: '途寒', content: '你个***********', likeCount: 0, commentCount: 1, reportCount: 6, submitTime: '2025-08-05 13:09:26', status: '管理删除', statusNote: '已删除', lastOperator: 'ningliang' },
])
const handleSearch = () => { message.info('搜索完成（原型展示）') }
const handleManage = (record: any) => { message.info(`管理评论: ${record.id}（原型展示）`) }
</script>

<style scoped>
.page-header { margin-bottom: 16px; }
.page-header h2 { margin: 0; }
.search-area { margin-bottom: 16px; padding: 16px; background: #fafafa; border-radius: 4px; }
.search-area :deep(.ant-form-item) { margin-bottom: 8px; }
.table-area { background: #fff; border: 1px solid #f0f0f0; border-radius: 4px; }
.text-warning { color: #faad14; }
.text-danger { color: #ff4d4f; }
.status-note { font-size: 12px; color: #ff4d4f; }
</style>
