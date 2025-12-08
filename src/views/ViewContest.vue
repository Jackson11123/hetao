<template>
  <div class="view-contest">
    <div class="content-box">
      <div class="page-header">
        <h2>查看比赛</h2>
      </div>

      <a-form layout="vertical" class="form-content">
        <a-form-item label="比赛标题" required>
          <a-input :value="formData.title" disabled />
        </a-form-item>

        <a-form-item label="比赛描述" required>
          <div class="markdown-editor readonly">
            <div class="editor-toolbar">
              <a-space>
                <a-button size="small" disabled><BoldOutlined /></a-button>
                <a-button size="small" disabled><UnderlineOutlined /></a-button>
                <a-button size="small" disabled><ItalicOutlined /></a-button>
                <a-button size="small" disabled><StrikethroughOutlined /></a-button>
                <a-button size="small" disabled>H</a-button>
                <a-button size="small" disabled><UnorderedListOutlined /></a-button>
                <a-button size="small" disabled><OrderedListOutlined /></a-button>
                <a-button size="small" disabled><CodeOutlined /></a-button>
                <a-button size="small" disabled><LinkOutlined /></a-button>
                <a-button size="small" disabled><TableOutlined /></a-button>
                <a-button size="small" disabled><UndoOutlined /></a-button>
                <a-button size="small" disabled><RedoOutlined /></a-button>
              </a-space>
            </div>
            <div class="editor-content">
              <div class="description-text">{{ formData.description }}</div>
            </div>
            <div class="editor-footer">
              <span class="word-count">字数: {{ formData.description.length }}</span>
            </div>
          </div>
        </a-form-item>

        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="开始时间" required>
              <a-input :value="formData.startTime" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="结束时间" required>
              <a-input :value="formData.endTime" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="比赛时长" required>
              <a-input :value="formData.duration" disabled />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="比赛赛事" required>
              <a-input :value="formData.contestEvent" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="16">
            <a-form-item label="语言列表">
              <a-checkbox-group :value="formData.languages" disabled>
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
              <a-input :value="formData.format" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="IO模式">
              <a-input :value="formData.ioMode" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="比赛权限">
              <a-input :value="formData.permission" disabled />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="赛后是否允许提交">
              <a-switch :checked="formData.allowPostSubmit" disabled checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否需要口令">
              <a-switch :checked="formData.needPassword" disabled checked-children="是" un-checked-children="否" />
              <a-input v-if="formData.needPassword" :value="formData.password" disabled style="width: 120px; margin-left: 8px" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="赛后是否需要口令">
              <a-switch :checked="formData.needPostPassword" disabled checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="课导老师是否允许查看成绩表">
          <a-switch :checked="formData.teacherViewScore" disabled checked-children="是" un-checked-children="否" />
        </a-form-item>

        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="是否展示题目难度信息">
              <a-switch :checked="formData.showDifficulty" disabled checked-children="否" un-checked-children="否" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否展示题目标签">
              <a-switch :checked="formData.showTags" disabled checked-children="否" un-checked-children="否" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item>
          <a-space>
            <a-button disabled>保 存</a-button>
            <a-button disabled>取 消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  BoldOutlined, UnderlineOutlined, ItalicOutlined, StrikethroughOutlined,
  OrderedListOutlined, UnorderedListOutlined, CodeOutlined, LinkOutlined,
  TableOutlined, UndoOutlined, RedoOutlined
} from '@ant-design/icons-vue'

const route = useRoute()

const formData = reactive({
  title: 'C++算法设计大赛初赛模拟卷1',
  description: '本次考试为 C++算法设计大赛模拟卷1，乐多赛制（优先第一次做对），建议时长为 2 个小时。\n\n比赛请认真作答！\n\n满分100分。\n\n结果以评测结果为准，\n\n加油❤️',
  startTime: '2025-12-05 17:00',
  endTime: '2026-03-31 00:00',
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

onMounted(() => {
  // 根据路由参数加载比赛数据
})
</script>

<style scoped>
.view-contest { padding: 40px 24px; background: #f5f5f5; min-height: calc(100vh - 64px); display: flex; flex-direction: column; align-items: center; }
.content-box { width: 100%; max-width: 1100px; background: #fff; border-radius: 8px; padding: 32px 40px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
.page-header { margin-bottom: 24px; }
.page-header h2 { margin: 0; font-size: 20px; font-weight: 600; }
.markdown-editor { border: 1px solid #d9d9d9; border-radius: 4px; overflow: hidden; }
.markdown-editor.readonly { background: #f5f5f5; }
.editor-toolbar { padding: 8px 12px; background: #fafafa; border-bottom: 1px solid #d9d9d9; }
.editor-content { min-height: 200px; padding: 12px; }
.description-text { white-space: pre-wrap; color: #666; }
.editor-footer { display: flex; justify-content: space-between; padding: 8px 12px; background: #fafafa; border-top: 1px solid #d9d9d9; }
.word-count { font-size: 12px; color: #999; }
</style>
