import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from './basic';

// import.meta.globEager() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.globEager('./modules/uibuilder*/*.ts') as any;
const routeModuleList: any[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [...routeModuleList];


// 根路由
export const RootRoute = {
  path: '/',
  name: 'Root',
  redirect: "/uibuilder",
  meta: {
    title: 'Root',
  },
  children: asyncRoutes
};

export const LoginRoute = {
  path: '/login',
  name: 'Login',
  component: () => import('@/pages/sys/login/Login.vue'),
  meta: {
    title: "登录",
  },
};

// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [
  RootRoute,
  LoginRoute,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE
];
