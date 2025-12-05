<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户管理</h2>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <a-form layout="inline">
        <a-form-item label="用户ID">
          <a-input
            v-model:value="searchUserId"
            placeholder="请输入用户ID"
            allow-clear
            style="width: 180px"
          />
        </a-form-item>
        <a-form-item label="昵称">
          <a-input
            v-model:value="searchNickname"
            placeholder="请输入昵称"
            allow-clear
            style="width: 180px"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button style="margin-left: 8px" @click="handleReset">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 用户表格 -->
    <div class="table-area">
      <a-table
        :columns="columns"
        :data-source="filteredUsers"
        :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
        row-key="userId"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space :wrap="false">
              <a @click="handleViewDetail(record)">查看详情</a>
              <a-divider type="vertical" />
              <a @click="handleEditRole(record)">编辑角色</a>
              <a-divider type="vertical" />
              <a @click="handleEditAward(record)">编辑奖项</a>
              <a-divider type="vertical" />
              <a @click="handleBan(record)" class="danger-link">封禁</a>
              <a-divider type="vertical" />
              <a @click="handleViewHomepage(record)">查看主页</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { User } from '../types'
import { mockUsers } from '../mock/data'

// 用户列表数据
const users = ref<User[]>([...mockUsers])

// 搜索条件
const searchUserId = ref('')
const searchNickname = ref('')

// 表格列定义
const columns = [
  {
    title: '用户ID',
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '真实姓名',
    dataIndex: 'realName',
    key: 'realName',
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '操作',
    key: 'action',
    width: 400,
  },
]

// 过滤后的用户列表
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchUserId = !searchUserId.value.trim() || 
      user.userId.toLowerCase().includes(searchUserId.value.toLowerCase())
    const matchNickname = !searchNickname.value.trim() || 
      user.nickname.toLowerCase().includes(searchNickname.value.toLowerCase())
    return matchUserId && matchNickname
  })
})

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已通过computed实现实时过滤
  message.info('搜索完成')
}

// 重置搜索条件
const handleReset = () => {
  searchUserId.value = ''
  searchNickname.value = ''
}

// 查看详情
const handleViewDetail = (user: User) => {
  message.info(`查看用户详情: ${user.nickname}（原型展示）`)
}

// 编辑角色
const handleEditRole = (user: User) => {
  message.info(`编辑用户角色: ${user.nickname}（原型展示）`)
}

// 编辑奖项
const handleEditAward = (user: User) => {
  message.info(`编辑用户奖项: ${user.nickname}（原型展示）`)
}

// 封禁用户
const handleBan = (user: User) => {
  message.warning(`封禁用户: ${user.nickname}（原型展示）`)
}

// 查看主页
const handleViewHomepage = (user: User) => {
  message.info(`查看用户主页: ${user.nickname}（原型展示）`)
}
</script>

<style scoped>
.user-management {
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

.table-area {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.danger-link {
  color: #ff4d4f;
}

.danger-link:hover {
  color: #ff7875;
}
</style>
