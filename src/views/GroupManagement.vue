<template>
  <div class="group-management">
    <div class="page-header">
      <h2>小组管理</h2>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <a-form layout="inline">
        <a-form-item label="小组名称">
          <a-input
            v-model:value="searchName"
            placeholder="请输入小组名称"
            allow-clear
            style="width: 180px"
          />
        </a-form-item>
        <a-form-item label="所属学校">
          <a-input
            v-model:value="searchSchool"
            placeholder="请输入学校名称"
            allow-clear
            style="width: 180px"
          />
        </a-form-item>
        <a-form-item label="所在省份">
          <a-select
            v-model:value="searchProvince"
            placeholder="请选择省份"
            allow-clear
            style="width: 150px"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="province in provinces" :key="province" :value="province">
              {{ province }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否前300">
          <a-select
            v-model:value="searchIsTop300"
            placeholder="请选择"
            allow-clear
            style="width: 120px"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="true">是</a-select-option>
            <a-select-option value="false">否</a-select-option>
          </a-select>
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
      <a-button type="primary" @click="handleCreate">
        <template #icon><PlusOutlined /></template>
        创建小组
      </a-button>
    </div>

    <!-- 小组表格 -->
    <div class="table-area">
      <a-table
        :columns="columns"
        :data-source="filteredGroups"
        :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
        row-key="id"
        :scroll="{ x: 1500 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'isTop300'">
            <a-tag :color="record.isTop300 ? 'green' : 'default'">
              {{ record.isTop300 ? '是' : '否' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'permission'">
            <div class="permission-cell">
              <a-select
                :value="record.permission"
                style="width: 140px"
                size="small"
                @change="(value: string) => handlePermissionChange(record, value)"
              >
                <a-select-option value="需管理员审核加入">需管理员审核加入</a-select-option>
                <a-select-option value="允许任何人加入">允许任何人加入</a-select-option>
                <a-select-option value="禁止加入">禁止加入</a-select-option>
              </a-select>
              <a-button type="link" size="small" @click="handleCopyPermission(record)">
                <template #icon><CopyOutlined /></template>
                复制
              </a-button>
            </div>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleManage(record)">管理</a>
              <a-divider type="vertical" />
              <a @click="handleView(record)">查看</a>
              <a-divider type="vertical" />
              <a @click="handleDelete(record)" class="danger-link">删除</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SearchOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Group } from '../types'
import { mockGroups } from '../mock/data'

const router = useRouter()

// 小组列表数据
const groups = ref<Group[]>([...mockGroups])

// 搜索条件
const searchName = ref('')
const searchSchool = ref('')
const searchProvince = ref('')
const searchIsTop300 = ref('')

// 省份列表
const provinces = ['北京', '上海', '广东', '浙江', '江苏', '四川', '湖北', '陕西', '山东', '河南']

// 表格列定义
const columns = [
  {
    title: '小组名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 80,
  },
  {
    title: '所有者',
    dataIndex: 'owner',
    key: 'owner',
    width: 120,
  },
  {
    title: '所属学校',
    dataIndex: 'school',
    key: 'school',
    width: 150,
  },
  {
    title: '所在省份',
    dataIndex: 'province',
    key: 'province',
    width: 100,
  },
  {
    title: '是否前300',
    key: 'isTop300',
    width: 100,
  },
  {
    title: '小组人数',
    dataIndex: 'memberCount',
    key: 'memberCount',
    width: 100,
  },
  {
    title: '题目数量',
    dataIndex: 'problemCount',
    key: 'problemCount',
    width: 100,
  },
  {
    title: '题单数量',
    dataIndex: 'problemListCount',
    key: 'problemListCount',
    width: 100,
  },
  {
    title: '比赛数量',
    dataIndex: 'contestCount',
    key: 'contestCount',
    width: 100,
  },
  {
    title: '权限',
    key: 'permission',
    width: 220,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right' as const,
  },
]

// 过滤后的小组列表
const filteredGroups = computed(() => {
  return groups.value.filter(group => {
    const matchName = !searchName.value.trim() || 
      group.name.toLowerCase().includes(searchName.value.toLowerCase())
    const matchSchool = !searchSchool.value.trim() || 
      group.school.toLowerCase().includes(searchSchool.value.toLowerCase())
    const matchProvince = !searchProvince.value || 
      group.province === searchProvince.value
    const matchIsTop300 = !searchIsTop300.value || 
      (searchIsTop300.value === 'true' ? group.isTop300 : !group.isTop300)
    return matchName && matchSchool && matchProvince && matchIsTop300
  })
})

// 搜索处理
const handleSearch = () => {
  message.info('搜索完成')
}

// 重置搜索条件
const handleReset = () => {
  searchName.value = ''
  searchSchool.value = ''
  searchProvince.value = ''
  searchIsTop300.value = ''
}

// 创建小组
const handleCreate = () => {
  message.info('创建小组（原型展示）')
}

// 权限变更
const handlePermissionChange = (group: Group, value: string) => {
  group.permission = value
  message.success(`已将 ${group.name} 权限修改为 ${value}`)
}

// 复制权限链接
const handleCopyPermission = (group: Group) => {
  message.success(`已复制 ${group.name} 的加入链接（原型展示）`)
}

// 管理小组
const handleManage = (group: Group) => {
  router.push({ name: 'GroupDetail', params: { id: group.id } })
}

// 查看小组
const handleView = (group: Group) => {
  message.info(`查看小组: ${group.name}（原型展示）`)
}

// 删除小组
const handleDelete = (group: Group) => {
  message.warning(`删除小组: ${group.name}（原型展示）`)
}
</script>

<style scoped>
.group-management {
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.permission-cell {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
