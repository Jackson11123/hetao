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
            <div class="action-buttons">
              <a @click="handleViewDetail(record)">查看详情</a>
              <a-divider type="vertical" />
              <a @click="handleEditRole(record)">编辑角色</a>
              <a-divider type="vertical" />
              <a @click="handleEditAward(record)">编辑奖项</a>
              <a-divider type="vertical" />
              <a @click="handleBan(record)" class="danger-link">封禁</a>
              <a-divider type="vertical" />
              <a @click="handleViewHomepage(record)">查看主页</a>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 编辑角色弹窗 -->
    <a-modal v-model:open="editRoleVisible" title="修改用户角色" @ok="handleEditRoleOk">
      <a-select v-model:value="editRoleForm.role" style="width: 100%">
        <a-select-option value="普通用户">普通用户</a-select-option>
        <a-select-option value="管理员">管理员</a-select-option>
        <a-select-option value="课导老师">课导老师</a-select-option>
        <a-select-option value="教研老师">教研老师</a-select-option>
        <a-select-option value="技校">技校</a-select-option>
      </a-select>
    </a-modal>

    <!-- 编辑奖项（CCF等级）弹窗 -->
    <a-modal v-model:open="editAwardVisible" title="修改用户CCF等级" @ok="handleEditAwardOk">
      <a-select v-model:value="editAwardForm.ccfLevel" style="width: 100%">
        <a-select-option value="无等级">无等级</a-select-option>
        <a-select-option value="CCF 3级">CCF 3级</a-select-option>
        <a-select-option value="CCF 4级">CCF 4级</a-select-option>
        <a-select-option value="CCF 5级">CCF 5级</a-select-option>
        <a-select-option value="CCF 6级">CCF 6级</a-select-option>
        <a-select-option value="CCF 7级">CCF 7级</a-select-option>
        <a-select-option value="CCF 8级">CCF 8级</a-select-option>
        <a-select-option value="CCF 9级">CCF 9级</a-select-option>
      </a-select>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { SearchOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { User } from '../types'
import { mockUsers } from '../mock/data'

const router = useRouter()

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
    width: 420,
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

// 编辑角色弹窗
const editRoleVisible = ref(false)
const editRoleForm = reactive({ userId: '', role: '' })
const currentEditUser = ref<User | null>(null)

// 编辑奖项弹窗
const editAwardVisible = ref(false)
const editAwardForm = reactive({ userId: '', ccfLevel: '无等级' })

// 查看详情
const handleViewDetail = (user: User) => {
  router.push({ name: 'UserDetail', params: { id: user.userId } })
}

// 编辑角色
const handleEditRole = (user: User) => {
  currentEditUser.value = user
  editRoleForm.userId = user.userId
  editRoleForm.role = user.role
  editRoleVisible.value = true
}

const handleEditRoleOk = () => {
  if (currentEditUser.value) {
    currentEditUser.value.role = editRoleForm.role
    message.success('角色修改成功')
  }
  editRoleVisible.value = false
}

// 编辑奖项
const handleEditAward = (user: User) => {
  editAwardForm.userId = user.userId
  editAwardForm.ccfLevel = '无等级'
  editAwardVisible.value = true
}

const handleEditAwardOk = () => {
  message.success('CCF等级修改成功')
  editAwardVisible.value = false
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

.action-buttons {
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
  align-items: center;
}
</style>
