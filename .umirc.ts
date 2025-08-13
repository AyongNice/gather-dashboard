import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '全埋点数据分析面板',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '埋点数据统计',
      path: '/home',
      component: './Home',
    },
    {
      name: '资源加载分析',
      path: '/access',
      component: './Access',
    },
  
  ],
  npmClient: 'yarn',
});

