import type { Router, RouteRecordRaw } from "vue-router";
import { usePermissionStoreWithOut } from "@/store/modules/permission";
import { useWorkspaceStoreWithOut } from "@/store/modules/workspace";
import { PageEnum } from "@/enums/pageEnum";
import { useUserStoreWithOut } from "@/store/modules/user";
import { PAGE_NOT_FOUND_ROUTE } from "@/router/routes/basic";
import { RootRoute } from "@/router/routes";
import { Recordable } from "@/types/global";
import { afterLoginAction, getSSOUserInfoAction } from "@/composition/index";
import { endToEndArr } from "@/composition/index";

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const ROOT_PATH = RootRoute.path;

const whitePathList: PageEnum[] = [LOGIN_PATH, PageEnum.PUBLISH, PageEnum.WEBSITE];

export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut();
  const useWorkspaceStore = useWorkspaceStoreWithOut();

  const permissionStore = usePermissionStoreWithOut();
  router.beforeEach(async (to, from, next) => {
    if (
      from.path === ROOT_PATH &&
      to.path === PageEnum.BASE_HOME &&
      userStore.getUserInfo.homePath &&
      userStore.getUserInfo.homePath !== PageEnum.BASE_HOME
    ) {
      next(userStore.getUserInfo.homePath);
      return;
    }

    const token = userStore.getUibToken;
    // 兼容DI获取值的问题
    userStore.getToken;

    // 端到端跳转
    if (to.path === PageEnum.WORKSPACE && to.query.type && endToEndArr.includes(String(to.query.type))) {
      useWorkspaceStore.setEndToEndInfo(to.query);
      const redirectData: { path: string; replace: boolean } = {
        path: to.path as string,
        replace: true,
      };
      next(redirectData);
    }

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path as PageEnum) || to.path.indexOf(PageEnum.PUBLISH) !== -1) {
      if (to.path === LOGIN_PATH && token) {
        const isSessionTimeout = userStore.getSessionTimeout;
        try {
          await afterLoginAction();
          if (!isSessionTimeout) {
            next((to.query?.redirect as string) || "/");
            return;
          }
        } catch {}
      }
      next();
      return;
    }

    // token does not exist
    if (!token) {
      // You can access without permission. You need to set the routing meta.ignoreAuth to true
      if (to.meta.ignoreAuth) {
        next();
        return;
      }
      // redirect login page
      let query: Recordable<string> = {};
      if (to.query) {
        query = to.query as Recordable<string>;
      }
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: String(LOGIN_PATH),
        replace: true,
        query,
      };
      if (to.path) {
        redirectData.query = {
          redirect: to.path,
          ...redirectData.query,
        };
      }
      next(redirectData);
      return;
    }

    // Jump to the 404 page after processing the login
    if (
      from.path === LOGIN_PATH &&
      to.name === PAGE_NOT_FOUND_ROUTE.name &&
      to.fullPath !== (userStore.getUserInfo.homePath || PageEnum.BASE_HOME)
    ) {
      next(userStore.getUserInfo.homePath || PageEnum.BASE_HOME);
      return;
    }

    // get userinfo while last fetch time is empty
    if (userStore.getLastUpdateTime === 0) {
      try {
        await getSSOUserInfoAction();
      } catch (err) {
        next();
        return;
      }
    }

    if (permissionStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);

    permissionStore.setDynamicAddedRoute(true);

    if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
      // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      next({ path: to.fullPath, replace: true, query: to.query });
    } else {
      const { query } = from;
      const { id } = query;
      const redirectPath = (from.query.redirect || to.path) as string;
      const redirect = decodeURIComponent(redirectPath);
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect, query: { id } };

      next(nextData);
    }
  });
}
