<template>
  <div class="group-submissions">
    <h3>全部提交</h3>
    
    <!-- 搜索区域 -->
    <div class="search-area">
      <a-space>
        <span>提交ID:</span>
        <a-input v-model:value="filters.submitId" placeholder="请输入" style="width: 100px" />
        <span>用户ID:</span>
        <a-input v-model:value="filters.userId" placeholder="请输入" style="width: 100px" />
        <span>题目ID:</span>
        <a-input v-model:value="filters.problemId" placeholder="请输入" style="width: 100px" />
        <span>比赛ID:</span>
        <a-input v-model:value="filters.contestId" placeholder="请输入" style="width: 100px" />
        <span>题单ID:</span>
        <a-input v-model:value="filters.listId" placeholder="请输入" style="width: 100px" />
        <a-button type="primary" @click="handleSearch">搜索</a-button>
      </a-space>
    </div>

    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="submissions"
      :pagination="{ pageSize: 20, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
      row-key="id"
      :scroll="{ x: 1600 }"
    >
      <template #emptyText>
        <a-empty description="暂无数据" />
      </template>
    </a-table>

    <!-- 翻页按钮 -->
    <div class="page-nav">
      <a-button>上一页</a-button>
      <a-button>下一页</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'

const filters = reactive({
  submitId: '',
  userId: '',
  problemId: '',
  contestId: '',
  listId: '',
})

const submissions = ref([])

const columns = [
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '题目编号', dataIndex: 'problemId', key: 'problemId', width: 100 },
  { title: '题目名称', dataIndex: 'problemName', key: 'problemName', width: 150 },
  { title: '用户ID', dataIndex: 'userId', key: 'userId', width: 100 },
  { title: '提交者', dataIndex: 'submitter', key: 'submitter', width: 100 },
  { title: '真实姓名', dataIndex: 'realName', key: 'realName', width: 100 },
  { title: '用时', dataIndex: 'time', key: 'time', width: 80 },
  { title: '内存', dataIndex: 'memory', key: 'memory', width: 80 },
  { title: '语言', dataIndex: 'language', key: 'language', width: 80 },
  { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 150 },
  { title: '判题时间', dataIndex: 'judgeTime', key: 'judgeTime', width: 150 },
  { title: '题目ID', dataIndex: 'problemIdCol', key: 'problemIdCol', width: 80 },
  { title: '比赛ID', dataIndex: 'contestId', key: 'contestId', width: 80 },
  { title: '题单ID', dataIndex: 'listId', key: 'listId', width: 80 },
  { title: '小组ID', dataIndex: 'groupId', key: 'groupId', width: 80 },
  { title: '题意ID', dataIndex: 'meaningId', key: 'meaningId', width: 80 },
]

const handleSearch = () => {
  message.info('搜索提交记录（原型展示）')
}
</script>

<style scoped>
.group-submissions {
  padding: 16px 0;
}

.group-submissions h3 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}

.search-area {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.page-nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}
</style>
