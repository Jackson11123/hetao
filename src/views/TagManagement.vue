<template>
  <div class="tag-management">
    <div class="page-header">
      <h2>标签管理</h2>
      <div class="header-actions">
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="搜索标签"
          style="width: 250px"
          allow-clear
          @search="onSearch"
          @change="onSearch"
        />
        <a-button type="primary" @click="handleCreate">
          <template #icon><PlusOutlined /></template>
          创建标签
        </a-button>
      </div>
    </div>

    <div class="stats-bar">
      <span>共 <strong>{{ totalCount }}</strong> 个标签</span>
    </div>

    <div class="tag-cloud">
      <a-tag
        v-for="tag in filteredTags"
        :key="tag.id"
        closable
        @close="handleDelete(tag)"
        class="tag-item"
      >
        {{ tag.name }}
      </a-tag>
      <a-empty v-if="filteredTags.length === 0" description="暂无标签" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Tag } from '../types'
import { mockTags } from '../mock/data'

// 标签列表数据
const tags = ref<Tag[]>([...mockTags])

// 搜索关键字
const searchKeyword = ref('')

// 总标签数
const totalCount = computed(() => tags.value.length)

// 过滤后的标签列表
const filteredTags = computed(() => {
  if (!searchKeyword.value.trim()) {
    return tags.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return tags.value.filter(tag => 
    tag.name.toLowerCase().includes(keyword)
  )
})

// 搜索处理
const onSearch = () => {
  // 搜索逻辑已通过computed实现实时过滤
}

// 创建标签
const handleCreate = () => {
  message.info('创建标签功能（原型展示）')
}

// 删除标签
const handleDelete = (tag: Tag) => {
  tags.value = tags.value.filter(t => t.id !== tag.id)
  message.success(`已删除标签: ${tag.name}`)
}
</script>

<style scoped>
.tag-management {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.stats-bar {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 4px;
}

.tag-cloud {
  padding: 16px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  min-height: 200px;
}

.tag-item {
  margin: 4px;
  padding: 4px 8px;
  font-size: 14px;
}
</style>
