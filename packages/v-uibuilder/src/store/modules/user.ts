import {
  ROLES_KEY,
  TOKEN_KEY,
  USER_INFO_KEY,
  REFRESH_TOKEN_KEY,
  EXPIRES_IN,
  UIB_TOKEN_KEY,
  UIB_USER_INFO_KEY,
  UIB_REFRESH_TOKEN_KEY,
  UIB_EXPIRES_IN,
} from "@/enums/cacheEnum";
import { RoleEnum } from "@/enums/roleEnum";
import { store } from "@/store";
import { UibUserInfo, UserInfo } from "@/types/store";
import { getAuthCache, removeAuthCache, setAuthCache } from "@/utils/auth";
import { defineStore } from "pinia";

enum EDIinfoKey {
  USER_INFO_KEY = "userInfo",
  TOKEN_KEY = "token",
  UIB_TOKEN_KEY = "uibToken",
  UIB_USER_INFO_KEY = "uibUserInfo",
}

interface UserState {
  userInfo: any;
  token: string | undefined;
  refreshToken: string | undefined;
  expiresIn: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  uibUserInfo: any;
  uibToken: string | undefined;
  uibRefreshToken: string | undefined;
  uibExpiresIn: string;
}

export const useUserStore = defineStore({
  id: "app-user",
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: "",
    // refresh_token
    refreshToken: "",
    // expires_in
    expiresIn: "",
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    // UIB user info
    uibUserInfo: null,
    // UIB token
    uibToken: "",
    // UIB refresh_token
    uibRefreshToken: "",
    // UIB expires_in
    uibExpiresIn: "",
  }),
  getters: {
    getUserInfo(): UserInfo {
      const userInfo = this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
      if (userInfo?.userId) {
        sessionStorage.setItem(EDIinfoKey.USER_INFO_KEY, JSON.stringify(userInfo));
      }
      return userInfo;
    },
    getToken(): string {
      // 有缓存?
      const token = this.token || getAuthCache<string>(TOKEN_KEY);
      if (token) {
        sessionStorage.setItem(EDIinfoKey.TOKEN_KEY, String(token));
      }
      return token;
    },
    getRefreshToken(): string {
      return this.refreshToken || getAuthCache<string>(REFRESH_TOKEN_KEY);
    },
    getExpiresIn(): string {
      return this.expiresIn || getAuthCache<string>(EXPIRES_IN);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    getUibUserInfo(): UibUserInfo {
      const userInfo = this.uibUserInfo || getAuthCache<UserInfo>(UIB_USER_INFO_KEY) || {};
      if (userInfo?.id) {
        sessionStorage.setItem(EDIinfoKey.UIB_USER_INFO_KEY, JSON.stringify(userInfo));
      }
      return userInfo;
    },
    getUibToken(): string {
      const token = this.uibToken || getAuthCache<string>(UIB_TOKEN_KEY);
      if (token) {
        sessionStorage.setItem(EDIinfoKey.UIB_TOKEN_KEY, String(token));
      }
      return token;
    },
    getUibRefreshToken(): string {
      return this.uibRefreshToken || getAuthCache<string>(UIB_REFRESH_TOKEN_KEY);
    },
    getUibExpiresIn(): string {
      return this.uibExpiresIn || getAuthCache<string>(UIB_EXPIRES_IN);
    },
  },
  actions: {
    setToken(token: string | undefined) {
      this.token = token;
      if (token) {
        setAuthCache(TOKEN_KEY, token);
        sessionStorage.setItem(EDIinfoKey.TOKEN_KEY, String(token));
      } else {
        removeAuthCache(TOKEN_KEY);
        sessionStorage.removeItem(EDIinfoKey.TOKEN_KEY);
      }
    },
    setUserInfo(info: UserInfo) {
      this.userInfo = info;
      if (info && Object.keys(info).length) {
        setAuthCache(USER_INFO_KEY, info);
        sessionStorage.setItem(EDIinfoKey.USER_INFO_KEY, JSON.stringify(info));
      } else {
        removeAuthCache(USER_INFO_KEY);
        sessionStorage.removeItem(EDIinfoKey.USER_INFO_KEY);
      }
    },
    setRefreshToken(token: string | undefined) {
      this.refreshToken = token;
      if (token) {
        setAuthCache(REFRESH_TOKEN_KEY, token);
      } else {
        removeAuthCache(REFRESH_TOKEN_KEY);
      }
    },
    setExpiresIn(time: string) {
      this.expiresIn = time;
      if (time) {
        setAuthCache(EXPIRES_IN, time);
      } else {
        removeAuthCache(EXPIRES_IN);
      }
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      if (roleList && roleList.length) {
        setAuthCache(ROLES_KEY, roleList);
      } else {
        removeAuthCache(ROLES_KEY);
      }
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    setUibToken(token: string | undefined) {
      this.uibToken = token;
      if (token) {
        setAuthCache(UIB_TOKEN_KEY, token);
        sessionStorage.setItem(EDIinfoKey.UIB_TOKEN_KEY, token);
      } else {
        removeAuthCache(UIB_TOKEN_KEY);
        sessionStorage.removeItem(EDIinfoKey.UIB_TOKEN_KEY);
      }
    },
    setUibUserInfo(info: UibUserInfo) {
      this.uibUserInfo = info;
      if (info && Object.keys(info).length) {
        this.lastUpdateTime = new Date().getTime();
        setAuthCache(UIB_USER_INFO_KEY, info);
        sessionStorage.setItem(EDIinfoKey.UIB_USER_INFO_KEY, JSON.stringify(info));
      } else {
        removeAuthCache(UIB_USER_INFO_KEY);
        sessionStorage.removeItem(EDIinfoKey.UIB_USER_INFO_KEY);
      }
    },
    setUibRefreshToken(token: string | undefined) {
      this.uibRefreshToken = token;
      if (token) {
        setAuthCache(UIB_REFRESH_TOKEN_KEY, token);
      } else {
        removeAuthCache(UIB_REFRESH_TOKEN_KEY);
      }
    },
    setUibExpiresIn(time: string) {
      this.uibExpiresIn = time;
      if (time) {
        setAuthCache(UIB_EXPIRES_IN, time);
      } else {
        removeAuthCache(UIB_EXPIRES_IN);
      }
    },
    resetState() {
      this.userInfo = null;
      this.token = "";
      this.roleList = [];
      this.sessionTimeout = false;
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
