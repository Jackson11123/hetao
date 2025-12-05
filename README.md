# 核桃 OJ 管理后台

核桃 OJ（Online Judge）是一个在线编程评测系统的管理后台原型，用于管理编程题目、比赛、用户和团队等功能。

## 功能模块

- **题目管理** - 创建和管理编程题目、客观题，支持题目标签分类
- **题库管理** - 管理多个题库，组织题目资源
- **题单管理** - 创建题目集合，方便学习和练习
- **比赛管理** - 创建和管理编程比赛
- **用户管理** - 管理系统用户
- **团队管理** - 支持团队协作，包含成员管理、角色权限、团队公告、申请审核等功能

## 技术栈

- Vue 3 + TypeScript
- Vite
- Vue Router
- Ant Design Vue

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── components/       # 公共组件
│   └── group/        # 团队相关组件
├── layouts/          # 布局组件
├── mock/             # 模拟数据
├── router/           # 路由配置
├── types/            # TypeScript 类型定义
└── views/            # 页面视图
```

## 参与开发

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -m 'Add xxx'`)
4. 推送到分支 (`git push origin feature/xxx`)
5. 创建 Merge Request
