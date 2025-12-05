<template>
  <div class="create-group">
    <div class="content-box">
      <div class="page-header">
        <h2>创建小组</h2>
      </div>

      <a-form :model="formData" layout="vertical" class="form-content">
        <!-- 小组名称 -->
        <a-form-item label="小组名称" required>
          <a-input v-model:value="formData.name" placeholder="请输入小组名称" />
        </a-form-item>

        <!-- 小组简介 -->
        <a-form-item label="小组简介">
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
                  placeholder="请输入小组简介（支持Markdown格式）"
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

        <!-- 小组权限、小组类型 -->
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="小组权限" required>
              <a-select v-model:value="formData.permission" style="width: 100%">
                <a-select-option value="需要通过验证加入">需要通过验证加入</a-select-option>
                <a-select-option value="允许任何人加入">允许任何人加入</a-select-option>
                <a-select-option value="禁止加入">禁止加入</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="小组类型" required>
              <a-select v-model:value="formData.type" style="width: 100%">
                <a-select-option value="内部小组">内部小组</a-select-option>
                <a-select-option value="外部小组">外部小组</a-select-option>
                <a-select-option value="to B/to G小组">to B/to G小组</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 所属学校、所在省、所在市、是否前300、学校别名 -->
        <a-row :gutter="24">
          <a-col :span="5">
            <a-form-item label="所属学校">
              <a-input v-model:value="formData.school" placeholder="请输入学校名称" />
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="所在省">
              <a-select v-model:value="formData.province" placeholder="请选择" style="width: 100%">
                <a-select-option v-for="p in provinces" :key="p" :value="p">{{ p }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="所在市">
              <a-select v-model:value="formData.city" placeholder="请选择" style="width: 100%">
                <a-select-option value="">请选择</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="是否前300">
              <a-input v-model:value="formData.isTop300" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="学校别名">
              <a-input v-model:value="formData.schoolAlias" placeholder="" />
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
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

const provinces = ['北京', '上海', '广东', '浙江', '江苏', '四川', '湖北', '陕西', '山东', '河南']

const formData = reactive({
  name: '',
  description: '',
  permission: '需要通过验证加入',
  type: '内部小组',
  school: '',
  province: '',
  city: '',
  isTop300: '',
  schoolAlias: '',
})

const handleSave = () => {
  if (!formData.name) {
    message.error('请输入小组名称')
    return
  }
  if (!formData.permission) {
    message.error('请选择小组权限')
    return
  }
  if (!formData.type) {
    message.error('请选择小组类型')
    return
  }
  message.success('小组创建成功（原型展示）')
  router.back()
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.create-group {
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
