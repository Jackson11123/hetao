<template>
  <div class="group-announcements">
    <div class="announcements-header">
      <h3>小组公告管理</h3>
      <a-button type="primary" @click="handleCreate">创建小组公告</a-button>
    </div>

    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="announcements"
      :pagination="{ pageSize: 20, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'isTop'">
          <a-tag v-if="record.isTop" color="red">置顶</a-tag>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDelete(record)" class="danger-link">删除</a>
          </a-space>
        </template>
      </template>
      <template #emptyText>
        <a-empty description="暂无数据" />
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'

interface Announcement {
  id: string
  avatar: string
  title: string
  likes: number
  views: number
  publisher: string
  publishTime: string
  isTop: boolean
}

const announcements = ref<Announcement[]>([])

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '头图', dataIndex: 'avatar', key: 'avatar', width: 80 },
  { title: '讨论标题', dataIndex: 'title', key: 'title', width: 200 },
  { title: '点赞/浏览', dataIndex: 'likes', key: 'likes', width: 100 },
  { title: '发表者', dataIndex: 'publisher', key: 'publisher', width: 120 },
  { title: '发表时间', dataIndex: 'publishTime', key: 'publishTime', width: 180 },
  { title: '置顶', key: 'isTop', width: 80 },
  { title: '操作', key: 'action', width: 120 },
]

const handleCreate = () => {
  message.info('创建小组公告（原型展示）')
}

const handleEdit = (record: Announcement) => {
  message.info(`编辑公告: ${record.title}（原型展示）`)
}

const handleDelete = (record: Announcement) => {
  message.warning(`删除公告: ${record.title}（原型展示）`)
}
</script>

<style scoped>
.group-announcements {
  padding: 16px 0;
}

.announcements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.announcements-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.danger-link {
  color: #ff4d4f;
}
</style>
