import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'tags',
        name: 'TagManagement',
        component: () => import('../views/TagManagement.vue'),
        meta: { title: '标签管理' }
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('../views/UserManagement.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'groups',
        name: 'GroupManagement',
        component: () => import('../views/GroupManagement.vue'),
        meta: { title: '小组管理' }
      },
      {
        path: 'groups/create',
        name: 'CreateGroup',
        component: () => import('../views/CreateGroup.vue'),
        meta: { title: '创建小组' }
      },
      {
        path: 'groups/:id',
        name: 'GroupDetail',
        component: () => import('../views/GroupDetail.vue'),
        meta: { title: '小组详情' }
      },
      {
        path: 'groups/:id/create-objective',
        name: 'GroupCreateObjective',
        component: () => import('../views/GroupCreateObjective.vue'),
        meta: { title: '创建客观题' }
      },
      {
        path: 'groups/:id/create-problem',
        name: 'GroupCreateProblem',
        component: () => import('../views/GroupCreateProblem.vue'),
        meta: { title: '创建OJ题' }
      },
      {
        path: 'groups/:id/create-problem-list',
        name: 'GroupCreateProblemList',
        component: () => import('../views/GroupCreateProblemList.vue'),
        meta: { title: '创建题单' }
      },
      {
        path: 'groups/:id/create-contest',
        name: 'GroupCreateContest',
        component: () => import('../views/GroupCreateContest.vue'),
        meta: { title: '创建比赛' }
      },
      {
        path: 'contests',
        name: 'ContestManagement',
        component: () => import('../views/ContestManagement.vue'),
        meta: { title: '比赛管理' }
      },
      {
        path: 'contests/create',
        name: 'CreateContest',
        component: () => import('../views/CreateContest.vue'),
        meta: { title: '创建比赛' }
      },
      {
        path: 'contests/:id',
        name: 'ContestDetail',
        component: () => import('../views/ContestDetail.vue'),
        meta: { title: '比赛详情' }
      },
      {
        path: 'contests/:id/edit',
        name: 'EditContest',
        component: () => import('../views/EditContest.vue'),
        meta: { title: '编辑比赛' }
      },
      {
        path: 'contests/:id/view',
        name: 'ViewContest',
        component: () => import('../views/ViewContest.vue'),
        meta: { title: '查看比赛' }
      },
      {
        path: 'contests/:id/announcement/create',
        name: 'CreateContestAnnouncement',
        component: () => import('../views/CreateContestAnnouncement.vue'),
        meta: { title: '创建比赛公告' }
      },
      {
        path: 'problem-lists',
        name: 'ProblemListManagement',
        component: () => import('../views/ProblemListManagement.vue'),
        meta: { title: '题单管理' }
      },
      {
        path: 'problem-lists/create',
        name: 'CreateProblemList',
        component: () => import('../views/CreateProblemList.vue'),
        meta: { title: '创建题单' }
      },
      {
        path: 'problem-lists/:id',
        name: 'ProblemListDetail',
        component: () => import('../views/ProblemListDetail.vue'),
        meta: { title: '题单题目管理' }
      },
      {
        path: 'problem-lists/:id/completion',
        name: 'ProblemListCompletion',
        component: () => import('../views/ProblemListCompletion.vue'),
        meta: { title: '题单完成情况' }
      },
      {
        path: 'problem-banks',
        name: 'ProblemBankManagement',
        component: () => import('../views/ProblemBankManagement.vue'),
        meta: { title: '题库管理' }
      },
      {
        path: 'problem-banks/create',
        name: 'CreateProblemBank',
        component: () => import('../views/CreateProblemBank.vue'),
        meta: { title: '创建题库' }
      },
      {
        path: 'problem-banks/:id',
        name: 'ProblemBankDetail',
        component: () => import('../views/ProblemBankDetail.vue'),
        meta: { title: '题目管理' }
      },
      {
        path: 'problems',
        name: 'ProblemManagement',
        component: () => import('../views/ProblemManagement.vue'),
        meta: { title: '题目管理' }
      },
      {
        path: 'problem-banks/:id/create-problem',
        name: 'CreateProblem',
        component: () => import('../views/CreateProblem.vue'),
        meta: { title: '创建OJ题' }
      },
      {
        path: 'problem-banks/:id/create-objective',
        name: 'CreateObjectiveProblem',
        component: () => import('../views/CreateObjectiveProblem.vue'),
        meta: { title: '创建客观题' }
      },
      {
        path: 'problem-banks/:bankId/problems/:problemId/solutions',
        name: 'ProblemSolutionManagement',
        component: () => import('../views/ProblemSolutionManagement.vue'),
        meta: { title: '题解管理' }
      },
      {
        path: 'content',
        name: 'ContentManagement',
        component: () => import('../views/ContentManagement.vue'),
        meta: { title: '内容管理' }
      },
      {
        path: 'submissions',
        name: 'Submissions',
        component: () => import('../views/Submissions.vue'),
        meta: { title: '全部提交' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
