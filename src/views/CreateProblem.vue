<template>
  <div class="create-problem">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-area">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <router-link to="/problem-banks">题库管理</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link :to="`/problem-banks/${bankId}`">{{ bankName }}</router-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="content-box">
      <div class="page-header">
        <h2>创建OJ题</h2>
        <a-button type="link" @click="handleCopyFromOther">从其他题目复制</a-button>
      </div>

      <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="config" tab="题目配置">
        <a-form :model="formData" layout="vertical" class="problem-form">
          <!-- 标题 -->
          <a-form-item label="标题" required>
            <a-input v-model:value="formData.title" placeholder="请输入标题" />
          </a-form-item>

          <!-- 题目描述 -->
          <a-form-item label="题目描述" required>
            <div class="markdown-editor">
              <div class="editor-toolbar">
                <a-space>
                  <a-button size="small" @click="insertFormat('bold')"><BoldOutlined /></a-button>
                  <a-button size="small" @click="insertFormat('underline')"><UnderlineOutlined /></a-button>
                  <a-button size="small" @click="insertFormat('italic')"><ItalicOutlined /></a-button>
                  <a-button size="small" @click="insertFormat('strikethrough')"><StrikethroughOutlined /></a-button>
                  <a-button size="small" @click="insertFormat('heading')">H</a-button>
                  <a-button size="small" @click="insertFormat('subscript')">x₂</a-button>
                  <a-button size="small" @click="insertFormat('superscript')">x²</a-button>
                  <a-button size="small" @click="insertFormat('quote')"><MenuOutlined /></a-button>
                  <a-button size="small" @click="insertFormat('ol')"><OrderedListOutlined /></a-button>
                  <a-button size="small" @click="insertFormat('ul')"><UnorderedListOutlined /></a-button>
                  <a-button size="small" @click="insertFormat('code')"><CodeOutlined /></a-button>
                  <a-button size="small" @click="insertFormat('image')"><PictureOutlined /></a-button>
                  <a-button size="small" @click="insertFormat('link')"><LinkOutlined /></a-button>
                  <a-button size="small" @click="insertFormat('imageLink')"><FileImageOutlined /></a-button>
                  <a-button size="small" @click="insertFormat('formula')">Ω</a-button>
                  <a-button size="small" @click="insertFormat('table')"><TableOutlined /></a-button>
                  <a-button size="small" @click="insertFormat('upload')"><UploadOutlined /></a-button>
                  <a-button size="small" @click="insertFormat('uploadImage')"><CloudUploadOutlined /></a-button>
                </a-space>
                <a-space class="toolbar-right">
                  <a-button size="small" @click="toggleFullscreen"><FullscreenOutlined /></a-button>
                  <a-button size="small" @click="togglePreview"><EyeOutlined /></a-button>
                  <a-button size="small"><CameraOutlined /></a-button>
                  <a-button size="small"><CodeSandboxOutlined /></a-button>
                  <a-button size="small"><MenuUnfoldOutlined /></a-button>
                </a-space>
              </div>
              <div class="editor-content">
                <div class="editor-input">
                  <a-textarea
                    v-model:value="formData.description"
                    :auto-size="{ minRows: 15, maxRows: 25 }"
                    placeholder="请输入题目描述（支持Markdown格式）"
                  />
                  <div class="word-count">字数: {{ formData.description.length }}</div>
                </div>
                <div class="editor-preview" v-if="showPreview">
                  <div class="preview-content markdown-body" v-html="renderedDescription"></div>
                </div>
              </div>
              <div class="editor-footer">
                <a-checkbox v-model:checked="syncScroll">同步滚动</a-checkbox>
              </div>
            </div>
          </a-form-item>

          <!-- 权限、难度、标签 -->
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="权限">
                <a-select v-model:value="formData.permission" placeholder="请选择权限">
                  <a-select-option value="private">私密题目</a-select-option>
                  <a-select-option value="public">公开题目</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="难度" required>
                <a-select v-model:value="formData.difficulty" placeholder="请选择题目难度">
                  <a-select-option v-for="diff in difficulties" :key="diff" :value="diff">
                    {{ diff }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="标签">
                <a-select
                  v-model:value="formData.tags"
                  mode="multiple"
                  placeholder="请选择标签"
                  :options="tagOptions"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <!-- 代码是否可分享 -->
          <a-form-item label="代码是否可分享">
            <a-switch v-model:checked="formData.codeShareable" />
          </a-form-item>

          <!-- 语言列表 -->
          <a-form-item label="语言列表" required>
            <a-checkbox-group v-model:value="formData.languages">
              <a-checkbox v-for="lang in availableLanguages" :key="lang.value" :value="lang.value">
                {{ lang.label }}
              </a-checkbox>
            </a-checkbox-group>
          </a-form-item>

          <!-- 文件IO -->
          <a-form-item label="文件IO">
            <a-space>
              <span>输入文件</span>
              <a-input v-model:value="formData.inputFile" placeholder="case.in" style="width: 150px" />
              <span>输出文件</span>
              <a-input v-model:value="formData.outputFile" placeholder="case.out" style="width: 150px" />
            </a-space>
          </a-form-item>

          <!-- 题解权限 -->
          <a-form-item label="题解权限">
            <a-select v-model:value="formData.solutionPermission" style="width: 200px">
              <a-select-option value="all">所有人可查看</a-select-option>
              <a-select-option value="ac">AC后可查看</a-select-option>
              <a-select-option value="none">不可查看</a-select-option>
            </a-select>
          </a-form-item>

          <!-- 操作按钮 -->
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="handleSave">保 存</a-button>
              <a-button @click="handleCancel">取 消</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="testcase" tab="数据点配置">
        <div class="testcase-config">
          <!-- 判题模式 -->
          <a-form-item label="判题模式" class="judge-mode-item">
            <a-radio-group v-model:value="judgeMode">
              <a-radio value="normal">普通判题</a-radio>
              <a-radio value="special">特殊判题</a-radio>
              <a-radio value="interactive">交互判题</a-radio>
            </a-radio-group>
          </a-form-item>

          <!-- 判题程序代码（特殊判题/交互判题时显示） -->
          <div v-if="judgeMode === 'special' || judgeMode === 'interactive'" class="judge-code-section">
            <div class="judge-code-header">
              <span class="judge-code-title">判题程序代码</span>
              <div class="judge-code-actions">
                <a-button type="primary" size="small" @click="handleCompileJudgeCode">编 译</a-button>
                <span class="judge-lang-label">判题程序语言</span>
                <a-select v-model:value="judgeCodeLang" size="small" style="width: 140px">
                  <a-select-option value="cpp14">C++14 With O2</a-select-option>
                  <a-select-option value="cpp17">C++17 With O2</a-select-option>
                  <a-select-option value="c">C</a-select-option>
                </a-select>
              </div>
            </div>
            <div class="judge-code-editor">
              <div class="code-line-numbers">
                <div v-for="n in judgeCodeLineCount" :key="n" class="line-number">{{ n }}</div>
              </div>
              <a-textarea
                v-model:value="judgeCode"
                :auto-size="{ minRows: 10, maxRows: 20 }"
                placeholder="请输入判题程序代码"
                class="code-textarea"
              />
            </div>
            <div class="judge-code-collapse" @click="toggleJudgeCodeCollapse">
              <UpOutlined v-if="!judgeCodeCollapsed" />
              <DownOutlined v-else />
            </div>
          </div>

          <!-- 上传方式选择（仅普通判题显示） -->
          <a-form-item v-if="judgeMode === 'normal'" label="上传方式" class="upload-mode-item">
            <a-radio-group :value="uploadMode" @change="handleUploadModeChange">
              <a-radio value="single">
                <span class="radio-label-with-help">
                  上传题目包(.zip)
                  <a-tooltip title="请上传完整题目包的压缩包，包括题面信息、数据点信息等">
                    <QuestionCircleOutlined class="help-icon-sup" />
                  </a-tooltip>
                </span>
              </a-radio>
              <a-radio value="package">
                <span class="radio-label-with-help">
                  上传数据包(.zip)
                  <a-tooltip title="请上传完整数据包的压缩包，格式为testdata文件夹的压缩包">
                    <QuestionCircleOutlined class="help-icon-sup" />
                  </a-tooltip>
                </span>
              </a-radio>
            </a-radio-group>
          </a-form-item>

          <!-- 文件上传（仅普通判题显示） -->
          <a-form-item v-if="judgeMode === 'normal'" label="文件" required class="upload-item">
            <div class="upload-row" v-if="uploadMode === 'single'">
              <a-upload
                :file-list="[]"
                :show-upload-list="false"
                :before-upload="beforeTestDataUpload"
                accept=".zip"
              >
                <a-button>
                  <UploadOutlined />
                  上传题目包
                </a-button>
              </a-upload>
              <span v-if="testDataFileList && testDataFileList.length > 0" class="uploaded-file-name">
                <LinkOutlined />
                {{ testDataFileList[0].name }}
              </span>
            </div>
            <div class="upload-tip" v-if="uploadMode === 'single'">
              支持 .zip 格式，上传后将自动解析出题目包文件
            </div>
            <div class="upload-row" v-if="uploadMode === 'package'">
              <a-upload
                :file-list="[]"
                :show-upload-list="false"
                :before-upload="beforePackageUpload"
                accept=".zip"
              >
                <a-button>
                  <UploadOutlined />
                  上传数据包
                </a-button>
              </a-upload>
              <span v-if="packageFileList && packageFileList.length > 0" class="uploaded-file-name">
                <LinkOutlined />
                {{ packageFileList[0].name }}
              </span>
            </div>
            <div class="upload-tip" v-if="uploadMode === 'package'">
              支持 .zip 格式，上传后将自动解析数据点
            </div>
          </a-form-item>

          <!-- 数据点配置表格 -->
          <div class="testcase-table-section">
            <div class="table-header">
              <span class="table-title">数据点配置</span>
              <a-button type="primary" size="small" @click="handleBatchMoveTestcase">批量移动数据点</a-button>
            </div>
            
            <a-table
              :columns="testcaseColumns"
              :data-source="flattenTestcaseList"
              :row-selection="testcaseRowSelection"
              :pagination="false"
              :locale="{ emptyText: '暂无数据' }"
              size="middle"
              :row-class-name="getRowClassName"
              :expandable="{ childrenColumnName: 'none' }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'index'">
                  <span v-if="record.isGroup" class="group-label">小组{{ record.groupIndex + 1 }}</span>
                  <span v-else>{{ record.displayIndex }}</span>
                </template>
                <template v-else-if="column.key === 'testcase'">
                  <a-input
                    v-if="record.isGroup"
                    v-model:value="record.dependency"
                    placeholder="前置依赖"
                    size="small"
                    style="width: 100px"
                  />
                  <span v-else>{{ record.testcase }}</span>
                </template>
                <template v-else-if="column.key === 'timeLimit'">
                  <a-input-number
                    v-model:value="record.timeLimit"
                    :min="100"
                    :max="10000"
                    size="small"
                    style="width: 100px"
                  />
                </template>
                <template v-else-if="column.key === 'memoryLimit'">
                  <a-input-number
                    v-model:value="record.memoryLimit"
                    :min="16"
                    :max="1024"
                    size="small"
                    style="width: 100px"
                  />
                </template>
                <template v-else-if="column.key === 'stackLimit'">
                  <a-input-number
                    v-model:value="record.stackLimit"
                    :min="16"
                    :max="1024"
                    size="small"
                    style="width: 100px"
                  />
                </template>
                <template v-else-if="column.key === 'score'">
                  <template v-if="record.isGroup">
                    <a-input-number
                      v-model:value="record.groupScore"
                      :min="0"
                      :max="100"
                      size="small"
                      style="width: 80px"
                    />
                    <span class="score-suffix">分</span>
                  </template>
                  <template v-else>
                    <a-input-number
                      v-model:value="record.score"
                      :min="0"
                      :max="100"
                      size="small"
                      style="width: 80px"
                    />
                  </template>
                </template>
                <template v-else-if="column.key === 'scoreType'">
                  <a-select 
                    v-if="record.isGroup" 
                    v-model:value="record.scoreType" 
                    size="small" 
                    style="width: 100px"
                  >
                    <a-select-option value="SUM">SUM</a-select-option>
                    <a-select-option value="MAX">MAX</a-select-option>
                    <a-select-option value="MIN">MIN</a-select-option>
                  </a-select>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-button 
                    v-if="record.isGroup" 
                    type="link" 
                    danger 
                    size="small" 
                    @click="handleDeleteGroup(record.groupIndex)"
                  >
                    删除小组
                  </a-button>
                </template>
              </template>
            </a-table>
          </div>

          <!-- 添加小组按钮 -->
          <div class="add-group-section">
            <a-button type="primary" @click="handleAddGroup">
              <PlusOutlined />
              添加小组
            </a-button>
          </div>

          <!-- 操作按钮 -->
          <div class="testcase-actions">
            <a-button type="primary" @click="handleSaveTestcase">保 存</a-button>
            <a-button @click="handleCancelTestcase">取 消</a-button>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    </div>

    <!-- 文件选择浮层 -->
    <a-modal
      v-model:open="fileSelectModalVisible"
      title="选择要导入的文件"
      width="600px"
      @ok="handleConfirmFileSelect"
      @cancel="handleCancelFileSelect"
      okText="确认导入"
      cancelText="取消"
    >
      <div class="file-select-modal">
        <a-tree
          v-model:checkedKeys="checkedFileKeys"
          v-model:expandedKeys="expandedFileKeys"
          :tree-data="fileTreeData"
          checkable
          :selectable="false"
          @check="onFileCheck"
        >
          <template #icon="{ dataRef }">
            <FolderOutlined v-if="dataRef.isFolder" style="color: #1890ff" />
            <FileOutlined v-else />
          </template>
          <template #title="{ dataRef }">
            <span>{{ dataRef.title }}</span>
          </template>
        </a-tree>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { marked } from 'marked'
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
  EyeOutlined,
  CameraOutlined,
  CodeSandboxOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  PlusOutlined,
  FolderOutlined,
  FileOutlined,
  UpOutlined,
  DownOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue'
import type { UploadProps, TreeProps } from 'ant-design-vue'
import { mockTags, mockProblemBanks } from '../mock/data'

const router = useRouter()
const route = useRoute()

// 题库信息
const bankId = ref(route.params.id as string)
const bankName = ref('')

onMounted(() => {
  const bank = mockProblemBanks.find(b => b.id === bankId.value)
  if (bank) {
    bankName.value = bank.name
  }
})

// 当前Tab
const activeTab = ref('config')

// 数据点配置相关
const judgeMode = ref('normal')
const uploadMode = ref('single')
const pendingUploadMode = ref<string | null>(null)
const testDataFileList = ref<UploadProps['fileList']>([])
const packageFileList = ref<UploadProps['fileList']>([])
const selectedTestcaseKeys = ref<string[]>([])

// 检查是否有已上传的数据
const hasUploadedData = computed(() => {
  return (testDataFileList.value && testDataFileList.value.length > 0) ||
         (packageFileList.value && packageFileList.value.length > 0) ||
         testcaseList.value.length > 0
})

// 切换上传方式的处理
const handleUploadModeChange = (e: any) => {
  const newMode = e.target.value
  if (newMode === uploadMode.value) return
  
  if (hasUploadedData.value) {
    pendingUploadMode.value = newMode
    showSwitchUploadModeConfirm()
  } else {
    uploadMode.value = newMode
  }
}

const showSwitchUploadModeConfirm = () => {
  Modal.confirm({
    title: '切换上传方式',
    content: '切换上传方式会清空数据点，请确认是否切换',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      // 清空所有数据
      testDataFileList.value = []
      packageFileList.value = []
      testcaseList.value = []
      // 切换上传方式
      if (pendingUploadMode.value) {
        uploadMode.value = pendingUploadMode.value
        pendingUploadMode.value = null
      }
    },
    onCancel() {
      pendingUploadMode.value = null
    }
  })
}

// 判题程序代码相关
const judgeCode = ref('')
const judgeCodeLang = ref('cpp14')
const judgeCodeCollapsed = ref(false)

const judgeCodeLineCount = computed(() => {
  if (!judgeCode.value) return 10
  const lines = judgeCode.value.split('\n').length
  return Math.max(lines, 10)
})

const handleCompileJudgeCode = () => {
  if (!judgeCode.value.trim()) {
    message.warning('请先输入判题程序代码')
    return
  }
  message.success('编译成功（原型展示）')
}

const toggleJudgeCodeCollapse = () => {
  judgeCodeCollapsed.value = !judgeCodeCollapsed.value
}

interface TestcaseItem {
  key: string
  testcase: string
  timeLimit: number
  memoryLimit: number
  stackLimit: number
  score: number
  scoreType?: string
  isGroup?: boolean
  groupScore?: number
  dependency?: string
  children?: TestcaseItem[]
}

const testcaseList = ref<TestcaseItem[]>([])

const testcaseColumns = [
  { title: '编号', key: 'index', width: 60 },
  { title: '数据点', key: 'testcase', dataIndex: 'testcase', width: 120 },
  { title: '时间限制(ms)', key: 'timeLimit', width: 130 },
  { title: '内存限制(mb)', key: 'memoryLimit', width: 130 },
  { title: '栈限制(mb)', key: 'stackLimit', width: 120 },
  { title: '分值(当前总分100分,需为100分)', key: 'score', width: 200 },
  { title: '计分方式', key: 'scoreType', width: 120 },
  { title: '操作', key: 'action', width: 100 },
]

const testcaseRowSelection = {
  selectedRowKeys: selectedTestcaseKeys,
  onChange: (keys: string[]) => {
    selectedTestcaseKeys.value = keys
  },
}

// 扁平化数据列表用于表格显示
interface FlatTestcaseItem extends TestcaseItem {
  isGroup?: boolean
  groupName?: string
  groupIndex?: number
  groupScore?: number
  dependency?: string
  displayIndex?: number
}

const flattenTestcaseList = computed(() => {
  const result: FlatTestcaseItem[] = []
  testcaseList.value.forEach((group, groupIndex) => {
    // 添加小组行
    result.push({
      ...group,
      key: `group_${groupIndex}`,
      isGroup: true,
      groupName: `小组${groupIndex + 1}`,
      groupIndex: groupIndex,
      groupScore: group.groupScore || 100,
      scoreType: group.scoreType || 'SUM',
      dependency: group.dependency || '',
    })
    // 添加小组下的数据点
    if (group.children) {
      group.children.forEach((item, itemIndex) => {
        result.push({
          ...item,
          key: `item_${groupIndex}_${itemIndex}`,
          isGroup: false,
          displayIndex: itemIndex + 1,
        })
      })
    }
  })
  return result
})

const getRowClassName = (record: FlatTestcaseItem) => {
  return record.isGroup ? 'group-row' : 'item-row'
}

const beforeTestDataUpload: UploadProps['beforeUpload'] = (file) => {
  testDataFileList.value = [file]
  // 清空数据包（覆盖逻辑）
  packageFileList.value = []
  
  // 模拟解析压缩包，显示文件选择浮层
  showFileSelectModal(file.name)
  return false
}

// 文件选择浮层相关
const fileSelectModalVisible = ref(false)
const checkedFileKeys = ref<string[]>([])
const expandedFileKeys = ref<string[]>(['additional_file', 'testdata'])

interface FileTreeNode {
  key: string
  title: string
  isFolder?: boolean
  size?: string
  children?: FileTreeNode[]
}

const fileTreeData = ref<FileTreeNode[]>([])

// 模拟压缩包内的文件结构
const mockFileTree: FileTreeNode[] = [
  {
    key: 'additional_file',
    title: 'additional_file',
    isFolder: true,
    children: [
      { key: 'additional_file/a_sample1.in', title: 'a_sample1.in', size: '23字节' },
      { key: 'additional_file/a_sample1.out', title: 'a_sample1.out', size: '4字节' },
      { key: 'additional_file/a_sample2.in', title: 'a_sample2.in', size: '38KB' },
      { key: 'additional_file/a_sample2.out', title: 'a_sample2.out', size: '9字节' },
      { key: 'additional_file/a_sample3.in', title: 'a_sample3.in', size: '1.9MB' },
      { key: 'additional_file/a_sample3.out', title: 'a_sample3.out', size: '11字节' },
      { key: 'additional_file/a_sample4.in', title: 'a_sample4.in', size: '2.7MB' },
      { key: 'additional_file/a_sample4.out', title: 'a_sample4.out', size: '19字节' },
    ]
  },
  {
    key: 'testdata',
    title: 'testdata',
    isFolder: true,
    children: [
      { key: 'testdata/config.yaml', title: 'config.yaml', size: '3KB' },
      // a1 系列
      { key: 'testdata/a1-1.in', title: 'a1-1.in', size: '2.7MB' },
      { key: 'testdata/a1-1.out', title: 'a1-1.out', size: '19字节' },
      { key: 'testdata/a1-2.in', title: 'a1-2.in', size: '2.7MB' },
      { key: 'testdata/a1-2.out', title: 'a1-2.out', size: '18字节' },
      { key: 'testdata/a1-3.in', title: 'a1-3.in', size: '2.7MB' },
      { key: 'testdata/a1-3.out', title: 'a1-3.out', size: '19字节' },
      { key: 'testdata/a1-4.in', title: 'a1-4.in', size: '2.7MB' },
      { key: 'testdata/a1-4.out', title: 'a1-4.out', size: '19字节' },
      { key: 'testdata/a1-5.in', title: 'a1-5.in', size: '2.7MB' },
      { key: 'testdata/a1-5.out', title: 'a1-5.out', size: '19字节' },
      { key: 'testdata/a1-6.in', title: 'a1-6.in', size: '2.7MB' },
      { key: 'testdata/a1-6.out', title: 'a1-6.out', size: '19字节' },
      { key: 'testdata/a1-7.in', title: 'a1-7.in', size: '2.7MB' },
      { key: 'testdata/a1-7.out', title: 'a1-7.out', size: '19字节' },
      { key: 'testdata/a1-8.in', title: 'a1-8.in', size: '2.7MB' },
      { key: 'testdata/a1-8.out', title: 'a1-8.out', size: '19字节' },
      { key: 'testdata/a1-9.in', title: 'a1-9.in', size: '2.7MB' },
      { key: 'testdata/a1-9.out', title: 'a1-9.out', size: '19字节' },
      { key: 'testdata/a1-10.in', title: 'a1-10.in', size: '2.7MB' },
      { key: 'testdata/a1-10.out', title: 'a1-10.out', size: '19字节' },
      // a2 系列
      { key: 'testdata/a2-1.in', title: 'a2-1.in', size: '2.7MB' },
      { key: 'testdata/a2-1.out', title: 'a2-1.out', size: '19字节' },
      { key: 'testdata/a2-2.in', title: 'a2-2.in', size: '2.7MB' },
      { key: 'testdata/a2-2.out', title: 'a2-2.out', size: '19字节' },
      { key: 'testdata/a2-3.in', title: 'a2-3.in', size: '2.7MB' },
      { key: 'testdata/a2-3.out', title: 'a2-3.out', size: '19字节' },
      { key: 'testdata/a2-4.in', title: 'a2-4.in', size: '2.7MB' },
      { key: 'testdata/a2-4.out', title: 'a2-4.out', size: '19字节' },
      { key: 'testdata/a2-5.in', title: 'a2-5.in', size: '2.7MB' },
      { key: 'testdata/a2-5.out', title: 'a2-5.out', size: '19字节' },
      { key: 'testdata/a2-6.in', title: 'a2-6.in', size: '2.7MB' },
      { key: 'testdata/a2-6.out', title: 'a2-6.out', size: '19字节' },
      { key: 'testdata/a2-7.in', title: 'a2-7.in', size: '2.7MB' },
      { key: 'testdata/a2-7.out', title: 'a2-7.out', size: '19字节' },
      { key: 'testdata/a2-8.in', title: 'a2-8.in', size: '2.7MB' },
      { key: 'testdata/a2-8.out', title: 'a2-8.out', size: '19字节' },
      { key: 'testdata/a2-9.in', title: 'a2-9.in', size: '2.7MB' },
      { key: 'testdata/a2-9.out', title: 'a2-9.out', size: '19字节' },
      { key: 'testdata/a2-10.in', title: 'a2-10.in', size: '2.7MB' },
      { key: 'testdata/a2-10.out', title: 'a2-10.out', size: '19字节' },
      // a3 系列
      { key: 'testdata/a3-1.in', title: 'a3-1.in', size: '2.7MB' },
      { key: 'testdata/a3-1.out', title: 'a3-1.out', size: '19字节' },
      { key: 'testdata/a3-2.in', title: 'a3-2.in', size: '2.7MB' },
      { key: 'testdata/a3-2.out', title: 'a3-2.out', size: '19字节' },
      { key: 'testdata/a3-3.in', title: 'a3-3.in', size: '2.7MB' },
      { key: 'testdata/a3-3.out', title: 'a3-3.out', size: '19字节' },
      { key: 'testdata/a3-4.in', title: 'a3-4.in', size: '2.7MB' },
      { key: 'testdata/a3-4.out', title: 'a3-4.out', size: '19字节' },
      { key: 'testdata/a3-5.in', title: 'a3-5.in', size: '2.7MB' },
      { key: 'testdata/a3-5.out', title: 'a3-5.out', size: '19字节' },
      { key: 'testdata/a3-6.in', title: 'a3-6.in', size: '38KB' },
      { key: 'testdata/a3-6.out', title: 'a3-6.out', size: '9字节' },
      { key: 'testdata/a3-7.in', title: 'a3-7.in', size: '2.7MB' },
      { key: 'testdata/a3-7.out', title: 'a3-7.out', size: '19字节' },
      { key: 'testdata/a3-8.in', title: 'a3-8.in', size: '2.7MB' },
      { key: 'testdata/a3-8.out', title: 'a3-8.out', size: '19字节' },
      { key: 'testdata/a3-9.in', title: 'a3-9.in', size: '2.7MB' },
      { key: 'testdata/a3-9.out', title: 'a3-9.out', size: '19字节' },
      { key: 'testdata/a3-10.in', title: 'a3-10.in', size: '38KB' },
      { key: 'testdata/a3-10.out', title: 'a3-10.out', size: '9字节' },
      // a4 系列
      { key: 'testdata/a4-1.in', title: 'a4-1.in', size: '1.9MB' },
      { key: 'testdata/a4-1.out', title: 'a4-1.out', size: '11字节' },
      { key: 'testdata/a4-2.in', title: 'a4-2.in', size: '1.9MB' },
      { key: 'testdata/a4-2.out', title: 'a4-2.out', size: '11字节' },
      { key: 'testdata/a4-3.in', title: 'a4-3.in', size: '1.9MB' },
      { key: 'testdata/a4-3.out', title: 'a4-3.out', size: '11字节' },
      { key: 'testdata/a4-4.in', title: 'a4-4.in', size: '1.9MB' },
      { key: 'testdata/a4-4.out', title: 'a4-4.out', size: '11字节' },
      { key: 'testdata/a4-5.in', title: 'a4-5.in', size: '1.9MB' },
      { key: 'testdata/a4-5.out', title: 'a4-5.out', size: '11字节' },
      { key: 'testdata/a4-6.in', title: 'a4-6.in', size: '1.9MB' },
      { key: 'testdata/a4-6.out', title: 'a4-6.out', size: '11字节' },
      { key: 'testdata/a4-7.in', title: 'a4-7.in', size: '1.9MB' },
      { key: 'testdata/a4-7.out', title: 'a4-7.out', size: '11字节' },
      { key: 'testdata/a4-8.in', title: 'a4-8.in', size: '1.9MB' },
      { key: 'testdata/a4-8.out', title: 'a4-8.out', size: '11字节' },
      { key: 'testdata/a4-9.in', title: 'a4-9.in', size: '1.9MB' },
      { key: 'testdata/a4-9.out', title: 'a4-9.out', size: '11字节' },
      { key: 'testdata/a4-10.in', title: 'a4-10.in', size: '1.9MB' },
      { key: 'testdata/a4-10.out', title: 'a4-10.out', size: '11字节' },
      // a5 系列
      { key: 'testdata/a5-1.in', title: 'a5-1.in', size: '2.7MB' },
      { key: 'testdata/a5-1.out', title: 'a5-1.out', size: '19字节' },
      { key: 'testdata/a5-2.in', title: 'a5-2.in', size: '2.7MB' },
      { key: 'testdata/a5-2.out', title: 'a5-2.out', size: '18字节' },
      { key: 'testdata/a5-3.in', title: 'a5-3.in', size: '2.7MB' },
      { key: 'testdata/a5-3.out', title: 'a5-3.out', size: '19字节' },
      { key: 'testdata/a5-4.in', title: 'a5-4.in', size: '2.7MB' },
      { key: 'testdata/a5-4.out', title: 'a5-4.out', size: '19字节' },
      { key: 'testdata/a5-5.in', title: 'a5-5.in', size: '2.7MB' },
      { key: 'testdata/a5-5.out', title: 'a5-5.out', size: '19字节' },
      { key: 'testdata/a5-6.in', title: 'a5-6.in', size: '2.7MB' },
      { key: 'testdata/a5-6.out', title: 'a5-6.out', size: '19字节' },
      { key: 'testdata/a5-7.in', title: 'a5-7.in', size: '2.7MB' },
      { key: 'testdata/a5-7.out', title: 'a5-7.out', size: '19字节' },
      { key: 'testdata/a5-8.in', title: 'a5-8.in', size: '2.7MB' },
      { key: 'testdata/a5-8.out', title: 'a5-8.out', size: '19字节' },
    ]
  },
  { key: 'problem_zh.md', title: 'problem_zh.md', size: '2KB' },
  { key: 'problem.yaml', title: 'problem.yaml', size: '85字节' },
]

// 模拟文件内容
const mockFileContents: Record<string, string> = {
  'problem.yaml': `pid: P97
owner: 82999
title: 圣诞树回收计划
tag:
  - T1
nSubmit: 2
nAccept: 3`,
  'problem_zh.md': `### 题目描述

圣诞节过了，小M想要将没用的圣诞树回收改造，改成一棵发财树。

圣诞树是一棵大小为 $n$ 的有根树，点 $1$ 是根，每条边的方向都是从父亲指向儿子。每个点 $i$ 有一个权重 $w_i$。发财树与圣诞树拥有相同的点集 $\\{1,2,\\dots,n\\}$，初始时不包含任何边。

重复执行以下操作直到圣诞树中不存在任何边：

* 在当前圣诞树中选择一条有向路径 $(a_0,a_1), (a_1,a_2), \\ldots, (a_{k-1},a_k)$，对每个 $1\\leqslant i\\leqslant k$，边 $(a_{i-1},a_i)$ 都存在于当前圣诞树中，且方向一致。将这 $k$ 条边从圣诞树中删除。
* 为发财树添加一条 $a_0$ 到 $a_k$ 的有向边。

在最终得到的发财树中，若从点 $u$ 沿有向边可以到达点 $v$，则称 $(u, v)$ 是一对可达点对，可达点对的权值为两点权重的乘积 $w_u \\cdot w_v$。发财树的权值为所有可达点对的权重之和。

小M打算把这棵发财树送给他的朋友小Z，但他不想送太好的发财树。他想知道能造出来的发财树的最小权值。

### 输入格式

第一行输入一个正整数 $n$，表示树的大小。

第二行输入 $n-1$ 个正整数 $p_2, p_3, \\dots, p_n$，表示点 $i$ 的父亲是 $p_i$。

第三行输入 $n$ 个正整数 $w_1, w_2, \\dots, w_n$，表示点 $i$ 的权重。

### 输出格式

输出一个整数，表示发财树的最小权值。

\`\`\`input1
4
1 1 2
2 1 3 2
\`\`\`

\`\`\`output1
16
\`\`\`

### 数据规模与约定

对于所有数据，$1 \\leq n \\leq 5000$，$1 \\leq w_i \\leq 10^9$。`,
  'testdata/config.yaml': `type: default
time: 2000ms
memory: 512MB
subtasks:
  - score: 8
    if: []
    id: 1
    type: min
    cases:
      - input: a1-1.in
        output: a1-1.out
      - input: a1-2.in
        output: a1-2.out
      - input: a1-3.in
        output: a1-3.out
      - input: a1-4.in
        output: a1-4.out
      - input: a1-5.in
        output: a1-5.out
      - input: a1-6.in
        output: a1-6.out
      - input: a1-7.in
        output: a1-7.out
      - input: a1-8.in
        output: a1-8.out
      - input: a1-9.in
        output: a1-9.out
      - input: a1-10.in
        output: a1-10.out
  - score: 8
    if:
      - 1
    id: 2
    type: min
    cases:
      - input: a2-1.in
        output: a2-1.out
      - input: a2-2.in
        output: a2-2.out
      - input: a2-3.in
        output: a2-3.out
      - input: a2-4.in
        output: a2-4.out
      - input: a2-5.in
        output: a2-5.out
      - input: a2-6.in
        output: a2-6.out
      - input: a2-7.in
        output: a2-7.out
      - input: a2-8.in
        output: a2-8.out
      - input: a2-9.in
        output: a2-9.out
      - input: a2-10.in
        output: a2-10.out
  - score: 36
    if:
      - 2
    id: 3
    type: sum
    cases:
      - input: a3-1.in
        output: a3-1.out
      - input: a3-2.in
        output: a3-2.out
      - input: a3-3.in
        output: a3-3.out
      - input: a3-4.in
        output: a3-4.out
      - input: a3-5.in
        output: a3-5.out
      - input: a3-6.in
        output: a3-6.out
      - input: a3-7.in
        output: a3-7.out
      - input: a3-8.in
        output: a3-8.out
      - input: a3-9.in
        output: a3-9.out
      - input: a3-10.in
        output: a3-10.out
  - score: 24
    if:
      - 3
    id: 4
    type: max
    cases:
      - input: a4-1.in
        output: a4-1.out
      - input: a4-2.in
        output: a4-2.out
      - input: a4-3.in
        output: a4-3.out
      - input: a4-4.in
        output: a4-4.out
      - input: a4-5.in
        output: a4-5.out
      - input: a4-6.in
        output: a4-6.out
      - input: a4-7.in
        output: a4-7.out
      - input: a4-8.in
        output: a4-8.out
      - input: a4-9.in
        output: a4-9.out
      - input: a4-10.in
        output: a4-10.out
  - score: 24
    if:
      - 4
    id: 5
    type: sum
    cases:
      - input: a5-1.in
        output: a5-1.out
      - input: a5-2.in
        output: a5-2.out
      - input: a5-3.in
        output: a5-3.out
      - input: a5-4.in
        output: a5-4.out
      - input: a5-5.in
        output: a5-5.out
      - input: a5-6.in
        output: a5-6.out
      - input: a5-7.in
        output: a5-7.out
      - input: a5-8.in
        output: a5-8.out`
}

const showFileSelectModal = (_fileName: string) => {
  fileTreeData.value = mockFileTree
  checkedFileKeys.value = []
  expandedFileKeys.value = ['additional_file', 'testdata']
  fileSelectModalVisible.value = true
}

const onFileCheck: TreeProps['onCheck'] = (_checkedKeys, _info) => {
  // 处理选中逻辑
}

// 解析 config.yaml 内容
interface ParsedSubtask {
  id: number
  score: number
  type: string
  cases: { input: string; output: string }[]
  dependency?: number[]
}

interface ParsedConfig {
  time: number
  memory: number
  subtasks: ParsedSubtask[]
}

const parseConfigYaml = (content: string): ParsedConfig | null => {
  try {
    // 解析全局时间和内存限制
    const timeMatch = content.match(/time:\s*(\d+)ms/)
    const memoryMatch = content.match(/memory:\s*(\d+)MB/)
    const time = timeMatch ? parseInt(timeMatch[1]) : 1000
    const memory = memoryMatch ? parseInt(memoryMatch[1]) : 128
    
    // 解析 subtasks
    const subtasks: ParsedSubtask[] = []
    
    // 使用正则匹配每个 subtask 块
    const subtaskPattern = /- score:\s*(\d+)\s*\n\s*if:\s*\n?((?:\s*- \d+\s*\n)*|\s*\[\]\s*\n)\s*id:\s*(\d+)\s*\n\s*type:\s*(\w+)\s*\n\s*cases:\s*\n((?:\s*- input:.*\n\s*output:.*\n?)*)/g
    
    let match
    while ((match = subtaskPattern.exec(content)) !== null) {
      const score = parseInt(match[1])
      const ifBlock = match[2]
      const id = parseInt(match[3])
      const type = match[4].toUpperCase()
      const casesBlock = match[5]
      
      // 解析依赖
      const dependency: number[] = []
      const depMatches = ifBlock.matchAll(/- (\d+)/g)
      for (const depMatch of depMatches) {
        dependency.push(parseInt(depMatch[1]))
      }
      
      // 解析 cases
      const cases: { input: string; output: string }[] = []
      const casePattern = /- input:\s*(\S+)\s*\n\s*output:\s*(\S+)/g
      let caseMatch
      while ((caseMatch = casePattern.exec(casesBlock)) !== null) {
        cases.push({
          input: caseMatch[1],
          output: caseMatch[2]
        })
      }
      
      subtasks.push({ id, score, type, cases, dependency })
    }
    
    // 按 id 排序
    subtasks.sort((a, b) => a.id - b.id)
    
    return { time, memory, subtasks }
  } catch (e) {
    console.error('解析 config.yaml 失败:', e)
    return null
  }
}

const handleConfirmFileSelect = () => {
  // 解析 problem.yaml 获取标题
  if (checkedFileKeys.value.includes('problem.yaml')) {
    const yamlContent = mockFileContents['problem.yaml']
    const titleMatch = yamlContent.match(/title:\s*(.+)/)
    if (titleMatch) {
      formData.title = titleMatch[1].trim()
    }
  }
  
  // 解析 problem_zh.md 获取题目描述
  if (checkedFileKeys.value.includes('problem_zh.md')) {
    formData.description = mockFileContents['problem_zh.md']
  }
  
  // 检查是否选中了 testdata/config.yaml
  const hasConfigYaml = checkedFileKeys.value.includes('testdata/config.yaml')
  let parsedTestcaseCount = 0
  
  if (hasConfigYaml) {
    // 使用 config.yaml 解析数据点分组
    const configContent = mockFileContents['testdata/config.yaml']
    const parsedConfig = parseConfigYaml(configContent)
    
    if (parsedConfig && parsedConfig.subtasks.length > 0) {
      const groups: TestcaseItem[] = parsedConfig.subtasks.map((subtask, index) => {
        const caseCount = subtask.cases.length
        const scorePerCase = caseCount > 0 ? Math.floor(subtask.score / caseCount) : 0
        
        const children: TestcaseItem[] = subtask.cases.map((c, caseIndex) => ({
          key: `tc_${index}_${caseIndex}_${Date.now()}`,
          testcase: c.input.replace('.in', ''),
          timeLimit: parsedConfig.time,
          memoryLimit: parsedConfig.memory,
          stackLimit: 128,
          score: scorePerCase,
        }))
        
        // 处理依赖关系
        const dependencyStr = subtask.dependency && subtask.dependency.length > 0 
          ? subtask.dependency.join(',') 
          : ''
        
        return {
          key: `group_${index}_${Date.now()}`,
          testcase: '',
          timeLimit: parsedConfig.time,
          memoryLimit: parsedConfig.memory,
          stackLimit: 128,
          score: 0,
          groupScore: subtask.score,
          scoreType: subtask.type,
          dependency: dependencyStr,
          isGroup: true,
          children: children,
        }
      })
      
      testcaseList.value = groups
      parsedTestcaseCount = groups.reduce((sum, g) => sum + (g.children?.length || 0), 0)
    }
  } else {
    // 原有逻辑：从选中的文件中提取 testdata 下的数据点
    const testdataFiles = checkedFileKeys.value.filter(key => 
      key.startsWith('testdata/') && (key.endsWith('.in') || key.endsWith('.out'))
    )
    
    // 提取唯一的数据点名称（去掉 .in/.out 后缀）
    const testcaseNames = new Set<string>()
    testdataFiles.forEach(file => {
      const fileName = file.replace('testdata/', '').replace(/\.(in|out)$/, '')
      testcaseNames.add(fileName)
    })
    
    // 生成数据点列表（放入一个小组中）
    if (testcaseNames.size > 0) {
      const children: TestcaseItem[] = Array.from(testcaseNames).sort().map((name, index) => ({
        key: `tc_${index}_${Date.now()}`,
        testcase: name,
        timeLimit: 1000,
        memoryLimit: 128,
        stackLimit: 128,
        score: Math.floor(100 / testcaseNames.size),
      }))
      
      testcaseList.value = [{
        key: `group_0_${Date.now()}`,
        testcase: '',
        timeLimit: 1000,
        memoryLimit: 128,
        stackLimit: 128,
        score: 0,
        groupScore: 100,
        scoreType: 'SUM',
        dependency: '',
        isGroup: true,
        children: children,
      }]
      parsedTestcaseCount = testcaseNames.size
    }
  }
  
  fileSelectModalVisible.value = false
  
  const selectedCount = checkedFileKeys.value.length
  const messages: string[] = []
  if (checkedFileKeys.value.includes('problem.yaml')) {
    messages.push('已解析题目标题')
  }
  if (checkedFileKeys.value.includes('problem_zh.md')) {
    messages.push('已解析题目描述')
  }
  if (hasConfigYaml) {
    messages.push(`已解析 ${testcaseList.value.length} 个小组共 ${parsedTestcaseCount} 个数据点`)
  } else if (parsedTestcaseCount > 0) {
    messages.push(`已解析 ${parsedTestcaseCount} 个数据点`)
  }
  
  message.success(`已导入 ${selectedCount} 个文件${messages.length > 0 ? '，' + messages.join('，') : ''}`)
}

const handleCancelFileSelect = () => {
  fileSelectModalVisible.value = false
  // 取消时清空上传的文件
  testDataFileList.value = []
}

const handleRemoveTestData = (file: any) => {
  const index = (testDataFileList.value || []).indexOf(file)
  const newFileList = (testDataFileList.value || []).slice()
  newFileList.splice(index, 1)
  testDataFileList.value = newFileList
}

const beforePackageUpload: UploadProps['beforeUpload'] = (file) => {
  // 覆盖之前的数据包和逐个上传的数据
  packageFileList.value = [file]
  testDataFileList.value = []
  testcaseList.value = []
  
  // 模拟解析数据包后生成数据点
  const mockTestcases: TestcaseItem[] = [
    { key: '1', testcase: 'test1', timeLimit: 1000, memoryLimit: 256, stackLimit: 128, score: 20, scoreType: 'binary' },
    { key: '2', testcase: 'test2', timeLimit: 1000, memoryLimit: 256, stackLimit: 128, score: 20, scoreType: 'binary' },
    { key: '3', testcase: 'test3', timeLimit: 1000, memoryLimit: 256, stackLimit: 128, score: 20, scoreType: 'binary' },
    { key: '4', testcase: 'test4', timeLimit: 1000, memoryLimit: 256, stackLimit: 128, score: 20, scoreType: 'binary' },
    { key: '5', testcase: 'test5', timeLimit: 1000, memoryLimit: 256, stackLimit: 128, score: 20, scoreType: 'binary' },
  ]
  testcaseList.value = mockTestcases
  
  message.success(`${file.name} 上传成功，已解析 ${mockTestcases.length} 个数据点（原型展示）`)
  return false
}

const handleRemovePackage = () => {
  packageFileList.value = []
  testcaseList.value = []
}

const handleBatchMoveTestcase = () => {
  if (selectedTestcaseKeys.value.length === 0) {
    message.warning('请先选择要移动的数据点')
    return
  }
  message.info('批量移动数据点（原型展示）')
}

const handleDeleteGroup = (groupIndex: number) => {
  testcaseList.value.splice(groupIndex, 1)
  message.success('删除小组成功')
}

const handleAddGroup = () => {
  testcaseList.value.push({
    key: `group_${Date.now()}`,
    testcase: '',
    timeLimit: 1000,
    memoryLimit: 128,
    stackLimit: 128,
    score: 0,
    groupScore: 0,
    scoreType: 'SUM',
    dependency: '',
    isGroup: true,
    children: [],
  })
  message.success('添加小组成功')
}

const handleSaveTestcase = () => {
  message.success('数据点配置保存成功（原型展示）')
}

const handleCancelTestcase = () => {
  activeTab.value = 'config'
}

// 表单数据
const formData = reactive({
  title: '',
  description: `### 题目背景

### 题目描述

### 输出格式
\`\`\`input1

\`\`\`

\`\`\`output1

\`\`\`

### 样例解释

### 数据规模与约定`,
  permission: 'private',
  difficulty: '',
  tags: [] as string[],
  codeShareable: false,
  languages: ['cpp14', 'cpp17', 'python3'],
  inputFile: 'case.in',
  outputFile: 'case.out',
  solutionPermission: 'all',
})

// 预览相关
const showPreview = ref(true)
const syncScroll = ref(true)

// Markdown 渲染
const renderedDescription = computed(() => {
  if (!formData.description) return ''
  return marked(formData.description) as string
})

// 难度列表
const difficulties = ['入门', '普及', '提高', '省选', 'NOI']

// 标签选项
const tagOptions = computed(() => mockTags.map(tag => ({ label: tag.name, value: tag.id })))

// 可用语言
const availableLanguages = [
  { label: 'C++14 With O2', value: 'cpp14' },
  { label: 'C++17 With O2', value: 'cpp17' },
  { label: 'Python3', value: 'python3' },
  { label: 'Java', value: 'java' },
  { label: 'C', value: 'c' },
]

// 插入格式
const insertFormat = (type: string) => {
  message.info(`插入${type}格式（原型展示）`)
}

// 切换全屏
const toggleFullscreen = () => {
  message.info('切换全屏模式（原型展示）')
}

// 切换预览
const togglePreview = () => {
  showPreview.value = !showPreview.value
}

// 从其他题目复制
const handleCopyFromOther = () => {
  message.info('从其他题目复制（原型展示）')
}

// 保存
const handleSave = () => {
  if (!formData.title) {
    message.error('请输入标题')
    return
  }
  if (!formData.difficulty) {
    message.error('请选择难度')
    return
  }
  if (formData.languages.length === 0) {
    message.error('请至少选择一种语言')
    return
  }
  message.success('题目创建成功（原型展示）')
  router.back()
}

// 取消
const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.create-problem {
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

.breadcrumb-area {
  width: 100%;
  max-width: 1100px;
  margin-bottom: 16px;
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

.problem-form {
  width: 100%;
}

.problem-form :deep(.ant-form-item-label > label) {
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
  min-height: 300px;
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

.word-count {
  padding: 4px 12px;
  font-size: 12px;
  color: #999;
  border-top: 1px solid #f0f0f0;
}

.editor-preview {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background: #fff;
}

.preview-content h4 {
  margin: 16px 0 8px;
  font-weight: 500;
  font-size: 14px;
}

.preview-content h4:first-child {
  margin-top: 0;
}

.sample-boxes {
  display: flex;
  gap: 12px;
}

.sample-box {
  flex: 1;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.sample-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
  font-size: 12px;
}

.dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27c93f; }

.sample-content {
  min-height: 50px;
  padding: 8px 10px;
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  padding: 8px 12px;
  background: #fafafa;
  border-top: 1px solid #d9d9d9;
}

.testcase-config {
  padding: 24px 0;
}

.judge-mode-item {
  margin-bottom: 24px;
}

.judge-mode-item :deep(.ant-form-item-label > label) {
  font-weight: 500;
}

/* 判题程序代码区域样式 */
.judge-code-section {
  margin-bottom: 24px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
}

.judge-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #d9d9d9;
}

.judge-code-title {
  font-weight: 500;
  font-size: 14px;
}

.judge-code-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.judge-code-actions :deep(.ant-btn-primary) {
  background: #722ed1;
  border-color: #722ed1;
}

.judge-code-actions :deep(.ant-btn-primary:hover) {
  background: #9254de;
  border-color: #9254de;
}

.judge-lang-label {
  color: #666;
  font-size: 14px;
}

.judge-code-editor {
  display: flex;
  min-height: 200px;
  max-height: 400px;
  overflow: auto;
}

.code-line-numbers {
  padding: 12px 8px;
  background: #f5f5f5;
  border-right: 1px solid #e8e8e8;
  text-align: right;
  user-select: none;
  min-width: 40px;
}

.line-number {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #999;
  height: 21px;
}

.code-textarea {
  flex: 1;
  border: none !important;
  border-radius: 0 !important;
  resize: none !important;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  padding: 12px !important;
}

.code-textarea:focus {
  box-shadow: none !important;
}

.judge-code-collapse {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background: #fafafa;
  border-top: 1px solid #d9d9d9;
  cursor: pointer;
  color: #666;
}

.judge-code-collapse:hover {
  background: #f0f0f0;
}

.upload-mode-item {
  margin-bottom: 24px;
}

.upload-mode-item :deep(.ant-form-item-label > label) {
  font-weight: 500;
}

.help-icon {
  margin-left: 4px;
  color: #999;
  font-size: 14px;
  cursor: help;
}

.help-icon:hover {
  color: #722ed1;
}

.radio-label-with-help {
  position: relative;
}

.help-icon-sup {
  position: relative;
  top: -6px;
  margin-left: 2px;
  color: #999;
  font-size: 12px;
  cursor: help;
}

.help-icon-sup:hover {
  color: #722ed1;
}

.upload-item {
  margin-bottom: 24px;
}

.upload-item :deep(.ant-form-item-label > label) {
  font-weight: 500;
}

.upload-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.uploaded-file-name {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.testcase-table-section {
  margin-bottom: 24px;
}

.testcase-table-section :deep(.ant-table-row-expand-icon-cell),
.testcase-table-section :deep(.ant-table-expand-icon-col) {
  display: none !important;
}

.testcase-table-section :deep(.ant-table-row-indent) {
  display: none !important;
}

.testcase-table-section :deep(.group-row) {
  background: #fafafa;
}

.testcase-table-section :deep(.group-row td) {
  font-weight: 500;
}

.testcase-table-section :deep(.item-row td:first-child) {
  padding-left: 32px;
}

.group-label {
  color: #333;
  font-weight: 500;
}

.score-suffix {
  margin-left: 4px;
  color: #666;
}

.table-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.table-title {
  font-weight: 500;
  font-size: 14px;
}

.table-header :deep(.ant-btn-primary) {
  background: #722ed1;
  border-color: #722ed1;
}

.table-header :deep(.ant-btn-primary:hover) {
  background: #9254de;
  border-color: #9254de;
}

.add-group-section {
  margin-bottom: 24px;
}

.add-group-section :deep(.ant-btn-primary) {
  background: #722ed1;
  border-color: #722ed1;
}

.add-group-section :deep(.ant-btn-primary:hover) {
  background: #9254de;
  border-color: #9254de;
}

.testcase-actions {
  display: flex;
  gap: 12px;
}

.testcase-actions :deep(.ant-btn-primary) {
  background: #faad14;
  border-color: #faad14;
}

.testcase-actions :deep(.ant-btn-primary:hover) {
  background: #ffc53d;
  border-color: #ffc53d;
}

/* 文件选择浮层样式 */
.file-select-modal {
  max-height: 400px;
  overflow-y: auto;
}

.file-select-modal :deep(.ant-tree) {
  font-size: 14px;
}

.file-select-modal :deep(.ant-tree-title) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.file-select-modal .file-size {
  color: #999;
  font-size: 12px;
  margin-left: 8px;
}

.file-select-modal :deep(.ant-tree-switcher) {
  width: 20px;
}

.file-select-modal :deep(.ant-tree-node-content-wrapper) {
  display: inline-flex;
  align-items: center;
}

.file-select-modal :deep(.ant-tree-iconEle) {
  margin-right: 4px;
}

/* Markdown 渲染样式 */
.markdown-body {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin: 20px 0 10px;
  font-weight: 600;
  line-height: 1.4;
}

.markdown-body h3 {
  font-size: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.markdown-body p {
  margin: 10px 0;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 24px;
  margin: 10px 0;
}

.markdown-body li {
  margin: 4px 0;
}

.markdown-body code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
}

.markdown-body pre {
  background: #f6f8fa;
  padding: 12px 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 12px 0;
}

.markdown-body pre code {
  background: none;
  padding: 0;
  font-size: 13px;
  line-height: 1.5;
}

.markdown-body blockquote {
  border-left: 4px solid #ddd;
  padding-left: 16px;
  margin: 12px 0;
  color: #666;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
}

.markdown-body th,
.markdown-body td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.markdown-body th {
  background: #f5f5f5;
  font-weight: 600;
}

.markdown-body img {
  max-width: 100%;
}
</style>
