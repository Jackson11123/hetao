<template>
  <div class="edit-contest">
    <div class="content-box">
      <div class="page-header">
        <h2>编辑比赛</h2>
      </div>

      <a-form :model="formData" layout="vertical" class="form-content">
        <a-form-item label="比赛标题" required>
          <a-input v-model:value="formData.title" placeholder="请输入比赛标题" />
        </a-form-item>

        <a-form-item label="比赛描述" required>
          <div class="markdown-editor">
            <div class="editor-toolbar">
              <a-space>
                <a-button size="small"><BoldOutlined /></a-button>
                <a-button size="small"><UnderlineOutlined /></a-button>
                <a-button size="small"><ItalicOutlined /></a-button>
                <a-button size="small"><StrikethroughOutlined /></a-button>
                <a-button size="small">H</a-button>
                <a-button size="small"><UnorderedListOutlined /></a-button>
                <a-button size="small"><OrderedListOutlined /></a-button>
                <a-button size="small"><CodeOutlined /></a-button>
                <a-button size="small"><LinkOutlined /></a-button>
                <a-button size="small"><TableOutlined /></a-button>
                <a-button size="small"><UndoOutlined /></a-button>
                <a-button size="small"><RedoOutlined /></a-button>
              </a-space>
            </div>
            <div class="editor-content">
              <div class="editor-input">
                <a-textarea v-model:value="formData.description" :auto-size="{ minRows: 10, maxRows: 18 }" />
              </div>
              <div class="editor-preview">
                <div class="preview-content" v-html="formData.description"></div>
              </div>
            </div>
            <div class="editor-footer">
              <span class="word-count">字数: {{ formData.description.length }}</span>
              <a-checkbox v-model:checked="syncScroll">同步滚动</a-checkbox>
            </div>
          </div>
        </a-form-item>

        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="开始时间" required>
              <a-date-picker v-model:value="formData.startTime" show-time style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="结束时间" required>
              <a-date-picker v-model:value="formData.endTime" show-time style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="比赛时长" required>
              <a-input v-model:value="formData.duration" disabled />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="比赛赛事" required>
              <a-select v-model:value="formData.contestEvent" style="width: 100%">
                <a-select-option value="核桃月赛">核桃月赛</a-select-option>
                <a-select-option value="核桃周赛">核桃周赛</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="16">
            <a-form-item label="语言列表">
              <a-checkbox-group v-model:value="formData.languages">
                <a-checkbox value="cpp14">C++14 With O2</a-checkbox>
                <a-checkbox value="cpp17">C++17 With O2</a-checkbox>
                <a-checkbox value="python3">Python3</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="比赛赛制" required>
              <a-select v-model:value="formData.format" style="width: 100%">
                <a-select-option value="乐多">乐多</a-select-option>
                <a-select-option value="OI">OI</a-select-option>
                <a-select-option value="ACM">ACM</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="IO模式">
              <a-select v-model:value="formData.ioMode" style="width: 100%">
                <a-select-option value="标准IO">标准IO</a-select-option>
                <a-select-option value="文件IO">文件IO</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="比赛权限">
              <a-select v-model:value="formData.permission" style="width: 100%">
                <a-select-option value="私密比赛">私密比赛</a-select-option>
                <a-select-option value="公开比赛">公开比赛</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="赛后是否允许提交">
              <a-switch v-model:checked="formData.allowPostSubmit" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否需要口令">
              <a-switch v-model:checked="formData.needPassword" checked-children="是" un-checked-children="否" />
              <a-input v-if="formData.needPassword" v-model:value="formData.password" placeholder="口令" style="width: 120px; margin-left: 8px" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="赛后是否需要口令">
              <a-switch v-model:checked="formData.needPostPassword" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="课导老师是否允许查看成绩表">
          <a-switch v-model:checked="formData.teacherViewScore" checked-children="是" un-checked-children="否" />
        </a-form-item>

        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="是否展示题目难度信息">
              <a-switch v-model:checked="formData.showDifficulty" checked-children="否" un-checked-children="否" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否展示题目标签">
              <a-switch v-model:checked="formData.showTags" checked-children="否" un-checked-children="否" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSave">保 存</a-button>
            <a-button @click="handleCancel">取 消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  BoldOutlined, UnderlineOutlined, ItalicOutlined, StrikethroughOutlined,
  OrderedListOutlined, UnorderedListOutlined, CodeOutlined, LinkOutlined,
  TableOutlined, UndoOutlined, RedoOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const syncScroll = ref(true)

const formData = reactive({
  title: 'C++算法设计大赛初赛模拟卷1',
  description: '本次考试为 C++算法设计大赛模拟卷1，乐多赛制（优先第一次做对），建议时长为 2 个小时。\n\n比赛请认真作答！\n\n满分100分。\n\n结果以评测结果为准，\n\n加油❤️',
  startTime: dayjs('2025-12-05 17:00'),
  endTime: dayjs('2026-03-31 00:00'),
  duration: '3月24日1小时',
  contestEvent: '核桃月赛',
  format: '乐多',
  languages: ['cpp14', 'cpp17'],
  ioMode: '标准IO',
  permission: '私密比赛',
  allowPostSubmit: true,
  needPassword: true,
  password: 'sfsjcs1',
  needPostPassword: true,
  teacherViewScore: true,
  showDifficulty: false,
  showTags: false
})

const handleSave = () => {
  if (!formData.title) { message.error('请输入比赛标题'); return }
  message.success('比赛保存成功（原型展示）')
  router.back()
}

const handleCancel = () => { router.back() }

onMounted(() => {
  // 根据路由参数加载比赛数据
})
</script>

<style scoped>
.edit-contest { padding: 40px 24px; background: #f5f5f5; min-height: calc(100vh - 64px); display: flex; flex-direction: column; align-items: center; }
.content-box { width: 100%; max-width: 1100px; background: #fff; border-radius: 8px; padding: 32px 40px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
.page-header { margin-bottom: 24px; }
.page-header h2 { margin: 0; font-size: 20px; font-weight: 600; }
.markdown-editor { border: 1px solid #d9d9d9; border-radius: 4px; overflow: hidden; }
.editor-toolbar { padding: 8px 12px; background: #fafafa; border-bottom: 1px solid #d9d9d9; }
.editor-content { display: flex; min-height: 200px; }
.editor-input { flex: 1; border-right: 1px solid #d9d9d9; }
.editor-input :deep(.ant-input) { border: none; border-radius: 0; }
.editor-preview { flex: 1; padding: 12px; overflow-y: auto; }
.editor-footer { display: flex; justify-content: space-between; padding: 8px 12px; background: #fafafa; border-top: 1px solid #d9d9d9; }
.word-count { font-size: 12px; color: #999; }
</style>
