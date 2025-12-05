// Tag 标签
export interface Tag {
  id: string
  name: string
}

// User 用户
export interface User {
  userId: string
  nickname: string
  realName: string
  role: string
  createdAt: string
}

// Group 小组
export interface Group {
  id: string
  name: string
  type: string
  owner: string
  school: string
  province: string
  isTop300: boolean
  memberCount: number
  problemCount: number
  problemListCount: number
  contestCount: number
  permission: string
}

// Contest 比赛
export interface Contest {
  id: string
  name: string
  owner: string
  duration: string
  format: string
  problemCount: number
  status: string
  registeredCount: number
  submittedCount: number
  reviewCount: number
  lastModifiedBy: string
  permission: string
}

// ProblemList 题单
export interface ProblemList {
  id: string
  title: string
  subtitle: string
  owner: string
  problemCount: number
  createdAt: string
  lastModifiedBy: string
  permission: string
}

// ProblemBank 题库
export interface ProblemBank {
  id: string
  name: string
  createdAt: string
  lastModifiedBy: string
  permission: 'public' | 'private'
}

// Problem 题目
export interface Problem {
  id: string
  name: string
  owner: string
  difficulty: string
  tags: string[]
  createdAt: string
  permission: string
}

// Solution 题解
export interface Solution {
  id: string
  publisherId: string
  publisherNickname: string
  title: string
  relatedProblem: string
  likeCount: number
  commentCount: number
  reportCount: number
  submittedAt: string
  status: string
  lastOperator: string
}
