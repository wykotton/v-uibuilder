import { ErrorMessageMode } from "@/types/axios";
import { useUserStoreWithOut } from "@/store/modules/user";
import { SSOUserInfoModel, LoginParams } from "@/api/sys/model/userModel";
import { doLogoutApi, getUserInfoApi, getSSOUserInfoApi, loginApi } from "@/api/sys/user";
import { PageEnum } from "@/enums/pageEnum";
import { useMessage } from "@/hooks/web/useMessage";
import { router } from "@/router";
import { PAGE_NOT_FOUND_ROUTE } from "@/router/routes/basic";
import { UibUserInfo, UserInfo } from "@/types/store";
import { isArray } from "lodash-es";
import { RouteRecordRaw } from "vue-router";
import { usePermissionStore } from "@/store/modules/permission";
import { getAuthCache } from "@/utils/auth";
import { TOKEN_KEY } from "@/enums/cacheEnum";
import { RoleEnum } from "@/enums/roleEnum";
import { notification } from "ant-design-vue";

// pinia
const useUserStore = useUserStoreWithOut();

/**
 * UIB用户登录
 * @description: login
 */
export async function login(
  params: LoginParams & {
    goHome?: boolean;
    mode?: ErrorMessageMode;
  }
): Promise<any> {
  try {
    const { goHome = true, mode, ...loginParams } = params;
    const request = await loginApi(loginParams, mode);
    const {
      results,
      info: { msg = "" },
    } = request.data;
    if (msg !== "success") {
      notification.error({
        message: msg,
        duration: 3,
      });
      return null;
    }
    if (results?.id) {
      useUserStore.setUibUserInfo(results);
      results?.token ? useUserStore.setUibToken(results.token) : void 0;
      results?.refreshToken ? useUserStore.setUibRefreshToken(results.refreshToken) : void 0;
      results?.expiresIn ? useUserStore.setUibExpiresIn(results.expiresIn) : void 0;
      const sessionTimeout = useUserStore.sessionTimeout;
      if (sessionTimeout) {
        useUserStore.setSessionTimeout(false);
      } else if (goHome) {
        await router.replace(PageEnum.WORKSPACE);
      }
      return results;
    } else {
      notification.error({
        message: "登录失败，请稍后重试！",
        duration: 3,
      });
      return null;
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * 获取UIB的用户信息
 * @param token
 * @returns
 */
export async function getUserInfo(token: string) {
  if (!token) return {};
  const request = await getUserInfoApi({ token });
  const {
    results,
    info: { msg = "" },
  } = request.data;
  if (msg !== "success") return null;
  if (results?.id) {
    return results;
  } else {
    return null;
  }
}

/**
 * SSO用户登录
 * @description: ssoLogin
 */
export async function ssoLogin(token: string): Promise<SSOUserInfoModel | null> {
  try {
    // save token
    useUserStore.setToken(token);
    // SSO用户信息
    const userInfo = await getSSOUserInfoAction();
    if (userInfo?.userId) {
      const params = { username: userInfo.username, password: "", isSSO: 1, ssoUserId: String(userInfo.userId) };
      const request = await loginApi(params);
      const {
        results,
        info: { msg = "" },
      } = request.data;
      if (msg !== "success") {
        notification.error({
          message: msg,
          duration: 3,
        });
        return null;
      }
      if (results?.id) {
        useUserStore.setSessionTimeout(false);
        useUserStore.setUibUserInfo(results);
        results?.token ? useUserStore.setUibToken(results.token) : void 0;
        results?.refreshToken ? useUserStore.setUibRefreshToken(results.refreshToken) : void 0;
        results?.expiresIn ? useUserStore.setUibExpiresIn(results.expiresIn) : void 0;
        await router.replace(PageEnum.WORKSPACE);
        return results;
      } else {
        notification.error({
          message: "登录失败，请稍后重试！",
          duration: 3,
        });
        return null;
      }
    }
    return null;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * 获取SSO用户信息操作
 * @param type
 * @returns
 */
export async function getSSOUserInfoAction(): Promise<UserInfo | null> {
  if (!useUserStore.token || !getAuthCache(TOKEN_KEY)) return null;
  const userInfo = await getSSOUserInfoApi({ access_token: useUserStore.token });
  const { roles = [] } = userInfo;
  if (isArray(roles)) {
    const roleList = roles.map((item) => item.value) as RoleEnum[];
    useUserStore.setRoleList(roleList);
  } else {
    userInfo.roles = [];
    useUserStore.setRoleList([]);
  }
  useUserStore.setUserInfo(userInfo);
  return userInfo;
}

export async function afterLoginAction(goHome?: boolean): Promise<SSOUserInfoModel | null> {
  if (!useUserStore.getUibToken) return null;
  // get user info
  const userInfo = await getSSOUserInfoAction();

  const sessionTimeout = useUserStore.sessionTimeout;
  if (sessionTimeout) {
    useUserStore.setSessionTimeout(false);
  } else {
    const permissionStore = usePermissionStore();
    if (!permissionStore.isDynamicAddedRoute) {
      // const routes = await permissionStore.buildRoutesAction();
      // routes.forEach((route: any) => {
      //   router.addRoute(route as unknown as RouteRecordRaw);
      // });
      router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
      permissionStore.setDynamicAddedRoute(true);
    }
    goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
  }
  return userInfo;
}

/**
 * @description: logout
 */ 
export async function logout(goLogin = false) {
  try {
    // await doLogoutApi();
  } catch {
    console.log("注销Token失败");
  }
  useUserStore.setUibToken(void 0);
  useUserStore.setUibUserInfo({} as UibUserInfo);
  useUserStore.setUibRefreshToken(void 0);
  useUserStore.setUibExpiresIn("");
  useUserStore.setToken(void 0);
  useUserStore.setUserInfo({} as UserInfo);
  useUserStore.setRefreshToken(void 0);
  useUserStore.setExpiresIn("");
  useUserStore.setSessionTimeout(false);
  goLogin && router.replace(PageEnum.BASE_LOGIN);
}

/**
 * @description: Confirm before logging out
 */
export function confirmLoginOut() {
  const { createConfirm } = useMessage();
  createConfirm({
    iconType: "warning",
    title: "温馨提醒",
    content: "是否确认退出系统?",
    onOk: async () => {
      await logout(true);
    },
  });
}
