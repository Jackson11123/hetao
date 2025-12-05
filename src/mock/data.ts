import type { Tag, User, Group, Contest, ProblemList, ProblemBank, Problem, Solution } from '../types'

// 标签模拟数据
export const mockTags: Tag[] = [
  { id: '1', name: '动态规划' },
  { id: '2', name: '贪心算法' },
  { id: '3', name: '图论' },
  { id: '4', name: '数据结构' },
  { id: '5', name: '字符串' },
  { id: '6', name: '数学' },
  { id: '7', name: '搜索' },
  { id: '8', name: '模拟' },
  { id: '9', name: '排序' },
  { id: '10', name: '二分查找' },
  { id: '11', name: '树' },
  { id: '12', name: '并查集' },
  { id: '13', name: '线段树' },
  { id: '14', name: '最短路' },
  { id: '15', name: '网络流' },
]

// 用户模拟数据
export const mockUsers: User[] = [
  { userId: 'U001', nickname: 'coder_zhang', realName: '张三', role: '管理员', createdAt: '2024-01-15' },
  { userId: 'U002', nickname: 'algo_master', realName: '李四', role: '普通用户', createdAt: '2024-02-20' },
  { userId: 'U003', nickname: 'dp_lover', realName: '王五', role: '普通用户', createdAt: '2024-03-10' },
  { userId: 'U004', nickname: 'graph_expert', realName: '赵六', role: '出题人', createdAt: '2024-04-05' },
  { userId: 'U005', nickname: 'string_ninja', realName: '钱七', role: '普通用户', createdAt: '2024-05-12' },
]

// 小组模拟数据
export const mockGroups: Group[] = [
  {
    id: 'G001',
    name: '清华大学ACM集训队',
    type: 'to B/to G小组',
    owner: 'coder_zhang',
    school: '清华大学',
    province: '北京',
    isTop300: true,
    memberCount: 50,
    problemCount: 200,
    problemListCount: 15,
    contestCount: 30,
    permission: '需管理员审核加入',
  },
  {
    id: 'G002',
    name: '北京大学算法社',
    type: '内部小组',
    owner: 'algo_master',
    school: '北京大学',
    province: '北京',
    isTop300: true,
    memberCount: 45,
    problemCount: 180,
    problemListCount: 12,
    contestCount: 25,
    permission: '允许任何人加入',
  },
  {
    id: 'G003',
    name: '算法爱好者联盟',
    type: '外部小组',
    owner: 'dp_lover',
    school: '浙江大学',
    province: '浙江',
    isTop300: false,
    memberCount: 120,
    problemCount: 80,
    problemListCount: 8,
    contestCount: 10,
    permission: '禁止加入',
  },
]

// 比赛模拟数据
export const mockContests: Contest[] = [
  {
    id: 'C001',
    name: '2024年春季算法挑战赛',
    owner: 'coder_zhang',
    duration: '3小时',
    format: 'ACM',
    problemCount: 8,
    status: '已结束',
    registeredCount: 500,
    submittedCount: 450,
    reviewCount: 100,
    lastModifiedBy: 'admin',
    permission: '公开',
  },
  {
    id: 'C002',
    name: '新手入门周赛',
    owner: 'algo_master',
    duration: '2小时',
    format: 'OI',
    problemCount: 5,
    status: '进行中',
    registeredCount: 200,
    submittedCount: 150,
    reviewCount: 30,
    lastModifiedBy: 'algo_master',
    permission: '公开',
  },
]

// 题单模拟数据
export const mockProblemLists: ProblemList[] = [
  {
    id: 'PL001',
    title: '动态规划入门',
    subtitle: '从零开始学习DP',
    owner: 'dp_lover',
    problemCount: 20,
    createdAt: '2024-01-10',
    lastModifiedBy: 'dp_lover',
    permission: '公开',
  },
  {
    id: 'PL002',
    title: '图论专题训练',
    subtitle: '最短路、最小生成树、网络流',
    owner: 'graph_expert',
    problemCount: 35,
    createdAt: '2024-02-15',
    lastModifiedBy: 'graph_expert',
    permission: '公开',
  },
]

// 题库模拟数据
export const mockProblemBanks: ProblemBank[] = [
  {
    id: 'PB001',
    name: '核桃OJ主题库',
    createdAt: '2023-01-01',
    lastModifiedBy: 'admin',
    permission: 'public',
  },
  {
    id: 'PB002',
    name: '校内训练题库',
    createdAt: '2023-06-15',
    lastModifiedBy: 'coder_zhang',
    permission: 'private',
  },
]

// 题目模拟数据
export const mockProblems: Problem[] = [
  {
    id: 'P1001',
    name: 'A+B Problem',
    owner: 'admin',
    difficulty: '入门',
    tags: ['模拟', '数学'],
    createdAt: '2023-01-01',
    permission: '公开',
  },
  {
    id: 'P1002',
    name: '最长上升子序列',
    owner: 'dp_lover',
    difficulty: '普及',
    tags: ['动态规划', '二分查找'],
    createdAt: '2023-02-10',
    permission: '公开',
  },
  {
    id: 'P1003',
    name: '最短路径',
    owner: 'graph_expert',
    difficulty: '提高',
    tags: ['图论', '最短路'],
    createdAt: '2023-03-20',
    permission: '公开',
  },
]

// 题解模拟数据
export const mockSolutions: Solution[] = [
  {
    id: 'S001',
    publisherId: 'U002',
    publisherNickname: 'algo_master',
    title: 'A+B Problem 详细题解',
    relatedProblem: 'P1001',
    likeCount: 100,
    commentCount: 20,
    reportCount: 0,
    submittedAt: '2024-01-20',
    status: '已通过',
    lastOperator: 'admin',
  },
  {
    id: 'S002',
    publisherId: 'U003',
    publisherNickname: 'dp_lover',
    title: 'LIS问题的三种解法',
    relatedProblem: 'P1002',
    likeCount: 250,
    commentCount: 45,
    reportCount: 1,
    submittedAt: '2024-02-15',
    status: '待审核',
    lastOperator: '',
  },
]
