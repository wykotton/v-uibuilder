import { ErrorMessageMode } from "@/types/axios";
import { defHttp } from "@/utils/http/axios";
import { LoginParams } from "./model/userModel";

enum Api {
  Login = "/ui-builder/login",
  Logout = "/rest/sso" + "/logout",
  GetUserInfo = "/ui-builder/getUserInfo",
  GetPermCode = "/rest/sso" + "/oauth2/token",
  GET_SSO_USERINFO = "/rest/sso" + "/userinfo",
  GET_THEME = "/ui-builder/get-theme",
  UPDATE_THEME = "/ui-builder/update-theme",
}

interface IAccessToken {
  redirect_uri?: string;
  client_id: string;
  grant_type: string;
  client_secret: string;
  code?: string;
  refresh_token?: string;
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = "modal") {
  return defHttp.post(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfoApi(params: Object) {
  return defHttp.get({ url: Api.GetUserInfo, params });
}

/**
 * 获取SSO用户信息
 * @param params
 * @returns
 */
export function getSSOUserInfoApi(params: Object) {
  return defHttp.get({ url: Api.GET_SSO_USERINFO, params });
}

/**
 * 获取SSO用户token
 * @param params
 * @returns
 */
export function getPermCode(params: IAccessToken) {
  return defHttp.post<string[]>({ url: Api.GetPermCode, params });
}

/**
 * 注销登录
 * @returns
 */
export function doLogoutApi() {
  return defHttp.get({ url: Api.Logout });
}

/**
 * 获取用户主题
 * @returns
 */
export function getTheme() {
  return defHttp.get({ url: Api.GET_THEME });
}

/**
 * 更新用户主题
 * @param params
 * @returns
 */
export function updateTheme(params: Object) {
  return defHttp.post({ url: Api.UPDATE_THEME, params });
}
