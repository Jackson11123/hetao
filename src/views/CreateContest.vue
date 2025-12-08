<template>
  <div class="create-contest">
    <div class="content-box">
      <div class="page-header">
        <h2>创建比赛</h2>
        <a-button type="link" @click="handleCopyFromOther">从其他比赛复制</a-button>
      </div>

      <a-form :model="formData" layout="vertical" class="form-content">
        <!-- 比赛标题 -->
        <a-form-item label="比赛标题" required>
          <a-input v-model:value="formData.title" placeholder="请输入比赛标题" />
        </a-form-item>

        <!-- 比赛描述 -->
        <a-form-item label="比赛描述" required>
          <div class="markdown-editor">
            <div class="editor-toolbar">
              <a-space>
                <a-button size="small"><BoldOutlined /></a-button>
                <a-button size="small"><UnderlineOutlined /></a-button>
                <a-button size="small"><ItalicOutlined /></a-button>
                <a-divider type="vertical" />
                <a-button size="small"><StrikethroughOutlined /></a-button>
                <a-button size="small">H</a-button>
                <a-button size="small">x₂</a-button>
                <a-button size="small">x²</a-button>
                <a-button size="small"><MenuOutlined /></a-button>
                <a-divider type="vertical" />
                <a-button size="small"><UnorderedListOutlined /></a-button>
                <a-button size="small"><OrderedListOutlined /></a-button>
                <a-divider type="vertical" />
                <a-button size="small"><CodeOutlined /></a-button>
                <a-button size="small"><PictureOutlined /></a-button>
                <a-button size="small"><LinkOutlined /></a-button>
                <a-button size="small"><FileImageOutlined /></a-button>
                <a-button size="small">Ω</a-button>
                <a-button size="small"><TableOutlined /></a-button>
                <a-button size="small"><UploadOutlined /></a-button>
                <a-button size="small"><CloudUploadOutlined /></a-button>
                <a-divider type="vertical" />
                <a-button size="small"><UndoOutlined /></a-button>
                <a-button size="small"><RedoOutlined /></a-button>
              </a-space>
              <a-space class="toolbar-right">
                <a-button size="small"><FullscreenOutlined /></a-button>
                <a-button size="small"><ExpandOutlined /></a-button>
                <a-button size="small"><EyeOutlined /></a-button>
                <a-button size="small"><SmileOutlined /></a-button>
                <a-button size="small"><CodeSandboxOutlined /></a-button>
                <a-button size="small"><MenuUnfoldOutlined /></a-button>
              </a-space>
            </div>
            <div class="editor-content">
              <div class="editor-input">
                <a-textarea
                  v-model:value="formData.description"
                  :auto-size="{ minRows: 12, maxRows: 20 }"
                  placeholder="请输入比赛描述（支持Markdown格式）"
                />
              </div>
              <div class="editor-preview">
                <div class="preview-content"></div>
              </div>
            </div>
            <div class="editor-footer">
              <span class="word-count">字数: {{ formData.description.length }}</span>
              <a-checkbox v-model:checked="syncScroll">同步滚动</a-checkbox>
            </div>
          </div>
        </a-form-item>

        <!-- 开始时间、结束时间、比赛时长 -->
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="开始时间" required>
              <a-date-picker
                v-model:value="formData.startTime"
                show-time
                placeholder="请选择开始时间"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="结束时间" required>
              <a-date-picker
                v-model:value="formData.endTime"
                show-time
                placeholder="请选择结束时间"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="比赛时长" required>
              <a-input v-model:value="formData.duration" disabled />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 比赛赛事、语言列表 -->
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="比赛赛事" required>
              <a-select v-model:value="formData.contestEvent" placeholder="请选择比赛赛事" style="width: 100%">
                <a-select-option value="核桃周赛">核桃周赛</a-select-option>
                <a-select-option value="核桃月赛">核桃月赛</a-select-option>
                <a-select-option value="CSP初赛">CSP初赛</a-select-option>
                <a-select-option value="CSP-J">CSP-J</a-select-option>
                <a-select-option value="CSP-S">CSP-S</a-select-option>
                <a-select-option value="NOIP">NOIP</a-select-option>
                <a-select-option value="C++培训">C++培训</a-select-option>
                <a-select-option value="是">是</a-select-option>
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

        <!-- 比赛赛制、IO模式、比赛权限 -->
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="比赛赛制" required>
              <a-select v-model:value="formData.format" placeholder="请选择比赛赛制" style="width: 100%">
                <a-select-option value="OI">OI</a-select-option>
                <a-select-option value="ACM">ACM</a-select-option>
                <a-select-option value="乐多">乐多</a-select-option>
                <a-select-option value="IOI">IOI</a-select-option>
                <a-select-option value="IOI(OFS)">IOI(OFS)</a-select-option>
                <a-select-option value="严格IOI">严格IOI</a-select-option>
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

        <!-- ACM赛制特有：是否开启封榜 -->
        <a-row v-if="formData.format === 'ACM'" :gutter="24">
          <a-col :span="8">
            <a-form-item label="是否开启封榜">
              <a-switch v-model:checked="formData.enableFreeze" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 通用开关：赛后是否允许提交、是否需要口令、是否在学生提交后展示客观题答案 -->
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="赛后是否允许提交">
              <a-switch v-model:checked="formData.allowPostSubmit" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否需要口令">
              <a-switch v-model:checked="formData.needPassword" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否在学生提交后展示客观题答案">
              <a-switch v-model:checked="formData.showObjectiveAnswer" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 课导老师是否允许查看成绩表 -->
        <a-form-item label="课导老师是否允许查看成绩表">
          <a-switch v-model:checked="formData.teacherViewScore" checked-children="是" un-checked-children="否" />
        </a-form-item>

        <!-- OI/IOI/IOI(OFS)/严格IOI赛制特有选项 -->
        <a-row v-if="isOIType" :gutter="24">
          <a-col :span="8">
            <a-form-item label="是否隐藏用户端提交结果">
              <a-switch v-model:checked="formData.hideSubmitResult" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
          <a-col :span="8" v-if="formData.format === 'OI'">
            <a-form-item label="个人比赛时间结束是否可看成绩">
              <a-switch v-model:checked="formData.viewScoreAfterEnd" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 是否展示题目难度信息、是否展示题目标签 -->
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="是否展示题目难度信息">
              <a-switch v-model:checked="formData.showDifficulty" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否展示题目标签">
              <a-switch v-model:checked="formData.showTags" checked-children="是" un-checked-children="否" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 操作按钮 -->
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
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import {
  BoldOutlined,
  UnderlineOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  CodeOutlined,
  PictureOutlined,
  LinkOutlined,
  FileImageOutlined,
  TableOutlined,
  UploadOutlined,
  CloudUploadOutlined,
  FullscreenOutlined,
  ExpandOutlined,
  EyeOutlined,
  SmileOutlined,
  CodeSandboxOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const syncScroll = ref(true)

const formData = reactive({
  title: '',
  description: '',
  startTime: null as Dayjs | null,
  endTime: null as Dayjs | null,
  duration: '',
  contestEvent: '',
  format: '',
  languages: ['cpp14', 'cpp17', 'python3'],
  ioMode: '标准IO',
  permission: '私密比赛',
  // ACM特有
  enableFreeze: false,
  // 通用开关
  allowPostSubmit: false,
  needPassword: false,
  showObjectiveAnswer: false,
  teacherViewScore: true,
  // OI类型特有
  hideSubmitResult: false,
  viewScoreAfterEnd: false,
  // 展示选项
  showDifficulty: false,
  showTags: false,
})

// 判断是否为OI类型赛制
const isOIType = computed(() => {
  return ['OI', 'IOI', 'IOI(OFS)', '严格IOI'].includes(formData.format)
})

const handleCopyFromOther = () => {
  message.info('从其他比赛复制（原型展示）')
}

const handleSave = () => {
  if (!formData.title) {
    message.error('请输入比赛标题')
    return
  }
  if (!formData.startTime) {
    message.error('请选择开始时间')
    return
  }
  if (!formData.endTime) {
    message.error('请选择结束时间')
    return
  }
  if (!formData.contestEvent) {
    message.error('请选择比赛赛事')
    return
  }
  if (!formData.format) {
    message.error('请选择比赛赛制')
    return
  }
  message.success('比赛创建成功（原型展示）')
  router.back()
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.create-contest {
  padding: 40px 24px;
  background: #f5f5f5;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-box {
  width: 100%;
  max-width: 1100px;
  background: #fff;
  border-radius: 8px;
  padding: 32px 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.form-content :deep(.ant-form-item-label > label) {
  font-weight: 500;
}

.markdown-editor {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #fafafa;
  border-bottom: 1px solid #d9d9d9;
  flex-wrap: wrap;
  gap: 4px;
}

.editor-content {
  display: flex;
  min-height: 200px;
}

.editor-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #d9d9d9;
}

.editor-input :deep(.ant-input) {
  border: none;
  border-radius: 0;
  resize: none;
  flex: 1;
}

.editor-preview {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background: #fff;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #fafafa;
  border-top: 1px solid #d9d9d9;
}

.word-count {
  font-size: 12px;
  color: #999;
}
</style>
