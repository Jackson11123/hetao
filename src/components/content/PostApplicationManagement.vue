<template>
  <div class="post-application-management">
    <div class="page-header">
      <h2>发帖申请表</h2>
      <div class="header-actions">
        <a-button @click="handleDownloadTemplate">下载模板</a-button>
        <a-button type="primary" @click="handleBatchImport">批量导入</a-button>
      </div>
    </div>
    <div class="search-area">
      <a-form layout="inline">
        <a-form-item label="昵称搜索/模..."><a-input v-model:value="searchForm.nickname" placeholder="" style="width: 120px" allow-clear /></a-form-item>
        <a-form-item label="UID搜索/精准..."><a-input v-model:value="searchForm.uid" placeholder="" style="width: 120px" allow-clear /></a-form-item>
        <a-form-item><a-button type="primary" @click="handleSearch">搜索</a-button></a-form-item>
      </a-form>
    </div>
    <div class="table-area">
      <a-table :columns="columns" :data-source="tableData" :pagination="pagination" row-key="id" :scroll="{ x: 1000 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'"><a @click="handleRemove(record)">移除</a></template>
          <template v-if="column.key === 'batchSelect'"><a-checkbox v-model:checked="record.selected" /></template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'

const searchForm = reactive({ nickname: '', uid: '' })
const pagination = reactive({ pageSize: 10, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` })
const columns = [
  { title: 'UID', dataIndex: 'uid', key: 'uid', width: 120 },
  { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 150 },
  { title: '封禁次数', dataIndex: 'banCount', key: 'banCount', width: 100 },
  { title: '最后操作人', dataIndex: 'lastOperator', key: 'lastOperator', width: 120 },
  { title: '时间', dataIndex: 'time', key: 'time', width: 160 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
  { title: '批量选择', key: 'batchSelect', width: 100 },
]
const tableData = ref([
  { id: '1', uid: '54082419', nickname: 'OJ小宋', banCount: '', lastOperator: 'Jm11', time: '2025-09-24 11:47:32', selected: false },
  { id: '2', uid: '46870412', nickname: '_Ward', banCount: '', lastOperator: '_Ward', time: '2025-09-24 14:54:09', selected: false },
  { id: '3', uid: '55090', nickname: '国海白', banCount: '', lastOperator: 'Jm11', time: '2025-09-24 15:40:19', selected: false },
  { id: '4', uid: '1302520', nickname: '王佳希', banCount: '', lastOperator: 'Jm11', time: '2025-09-24 15:40:19', selected: false },
  { id: '5', uid: '1451677', nickname: 'Haichao', banCount: '', lastOperator: 'Jm11', time: '2025-09-24 15:40:19', selected: false },
])
const handleSearch = () => { message.info('搜索完成（原型展示）') }
const handleRemove = (record: any) => { message.info(`移除申请: ${record.uid}（原型展示）`) }
const handleDownloadTemplate = () => { message.info('下载模板（原型展示）') }
const handleBatchImport = () => { message.info('批量导入（原型展示）') }
</script>

<style scoped>
.page-header { margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; }
.header-actions { display: flex; gap: 8px; }
.search-area { margin-bottom: 16px; padding: 16px; background: #fafafa; border-radius: 4px; }
.search-area :deep(.ant-form-item) { margin-bottom: 8px; }
.table-area { background: #fff; border: 1px solid #f0f0f0; border-radius: 4px; }
</style>
