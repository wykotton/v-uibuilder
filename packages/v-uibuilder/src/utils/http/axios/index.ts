// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import { ContentTypeEnum, RequestEnum, ResultEnum } from "@/enums/httpEnum";
import { useGlobSetting } from "@/hooks/setting";
import { useMessage } from "@/hooks/web/useMessage";
import { useErrorLogStoreWithOut } from "@/store/modules/errorLog";
import type { RequestOptions, Result } from "@/types/axios";
import { AxiosRetry } from "@/utils/http/axios/axiosRetry";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { clone, isObject, isString } from "lodash-es";
import { VAxios } from "./Axios";
import type { AxiosTransform, CreateAxiosOptions } from "./axiosTransform";
import { checkStatus } from "./checkStatus";
import { formatRequestDate, joinTimestamp } from "./helper";
import { useUserStoreWithOut } from "@/store/modules/user";
import { getPermCode } from "@/api/sys/user";
import { notification } from "ant-design-vue";
import { logout } from "@/composition";
import axios from "axios";

// pinia
const useUserStore = useUserStoreWithOut();

// 授权白名单，不添加token请求头
const AuthorizedWhiteList = ["/rest/sso/userinfo", "/rest/sso/oauth2/token"];

// 请求白名单，不校验token是否失效
const requestWhiteList = ["/ui-builder/login", "/rest/sso/logout", "/rest/sso/oauth2/token"];

// 刷新token
let ssoRefresh = false;
let uibRefresh = false;
// 重试队列，等待token刷新后重新请求
let requestsList: any = [];

const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;
const { createMessage, createErrorModal } = useMessage();

export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = "";
  for (const key in obj) {
    parameters += key + "=" + encodeURIComponent(obj[key]) + "&";
  }
  parameters = parameters.replace(/&$/, "");
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, "?") + parameters;
}

// 深度合并
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

// 处理sso的token刷新
async function ssoRefreshToken() {
  if (ssoRefresh) return ssoRefresh;
  ssoRefresh = true;
  try {
    const expiresIn = useUserStore.getExpiresIn;
    const newTime = +new Date();
    const expires_in = +new Date(expiresIn);
    if (!expiresIn) {
      ssoRefresh = false;
      return false;
    }
    if (expires_in - newTime <= 30 * 60 * 1000) {
      const refreshToken = useUserStore.getRefreshToken;
      if (!refreshToken) {
        ssoRefresh = false;
        return false;
      }
      const token: any = await getPermCode({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: "UIB",
        client_secret: "123",
      });
      const { access_token = "", refresh_token = "", expires_in = "" } = token;
      if (!access_token || !refresh_token || !expires_in) {
        ssoRefresh = false;
        return false;
      }
      useUserStore.setToken(access_token);
      useUserStore.setRefreshToken(refresh_token);
      useUserStore.setExpiresIn(expires_in);
    }
    ssoRefresh = false;
    return true;
  } catch (error) {
    ssoRefresh = false;
    console.log(error);
    return false;
  }
}

// 处理UIB的token刷新
async function uibRefreshToken(
  config: AxiosRequestConfig,
  options: CreateAxiosOptions
): Promise<AxiosRequestConfig<any>> {
  const uibToken = useUserStore?.getUibToken;
  if (uibToken && (config as any)?.requestOptions?.withToken !== false) {
    // jwt token
    if (config.url && !AuthorizedWhiteList.includes(config.url)) {
      (config as any).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${uibToken}`
        : uibToken;
    }
  }
  try {
    const expiresIn = useUserStore.getUibExpiresIn;
    const newTime = +new Date();
    const expires_in = +new Date(expiresIn);
    if (expires_in - newTime <= 30 * 60 * 1000) {
      if (!uibRefresh) {
        const refreshToken = useUserStore.getUibRefreshToken;
        if (!refreshToken) {
          notification.destroy();
          notification.error({
            message: "用户信息已失效, 请重新登录!",
            duration: 3,
          });
          logout(true);
        }
        uibRefresh = true;
        const request = await axios.get(globSetting.apiUrl + "/ui-builder/refresh-token", {
          headers: {
            Authorization: "Bearer " + refreshToken,
          },
        });
        uibRefresh = false;
        const {
          results,
          info: { msg = "" },
        } = request.data.data;
        if (msg !== "success") {
          // 清空重试队列
          requestsList = [];
          notification.destroy();
          notification.error({
            message: "用户信息已失效, 请重新登录!",
            duration: 3,
          });
          logout(true);
        }
        results?.token ? useUserStore.setUibToken(results.token) : void 0;
        results?.refreshToken ? useUserStore.setUibRefreshToken(results.refreshToken) : void 0;
        results?.expiresIn ? useUserStore.setUibExpiresIn(results.expiresIn) : void 0;
        if ((config as any).headers.Authorization) {
          (config as any).headers.Authorization = options.authenticationScheme
            ? `${options.authenticationScheme} ${results.token}`
            : results.token;
        }
        // 执行重试队列
        requestsList.forEach((req: any) => req(results.token));
        requestsList = [];
        return config;
      }
      // 存入重试队列
      const request = new Promise((resolve) => {
        requestsList.push((token: string) => {
          (config as any).headers.Authorization = options.authenticationScheme
            ? `${options.authenticationScheme} ${token}`
            : token;
          resolve(config);
        });
      });
      return request as AxiosRequestConfig<any>;
    }
    return config;
  } catch (error) {
    notification.destroy();
    notification.error({
      message: "用户信息已失效, 请重新登录!",
      duration: 3,
    });
    logout(true);
    return config;
  }
}

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformResponse, isReturnNativeResponse } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }
    // 错误的时候返回

    const { data } = res;
    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error(`请求出错,请稍后重试!`);
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code = 0, result, message } = data;
    data.code = 0; // 临时逻辑

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = (data && Reflect.has(data, "code") && code === ResultEnum.SUCCESS) || 200;
    if (hasSuccess) {
      // 后续统一node接口
      if (result) {
        return result;
      }
      return data;
    }

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = "";
    switch (code) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = `登录超时，请重新登录!`;
        const userStore = null as any;
        userStore.setToken(undefined);
        userStore.logout(true);
        break;
      default:
        if (message) {
          timeoutMsg = message;
        }
    }

    // errorMessageMode=‘modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    if (options.errorMessageMode === "modal") {
      createErrorModal({ title: `错误提示`, content: timeoutMsg });
    } else if (options.errorMessageMode === "message") {
      createMessage.error(timeoutMsg);
    }

    throw new Error(timeoutMsg || `请求出错,请稍后重试!`);
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl) && config.url?.includes("/ui-builder")) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (Reflect.has(config, "data") && config.data && Object.keys(config.data).length > 0) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, Object.assign({}, config.params, config.data));
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */

  requestInterceptors: async (config, options) => {
    // token白名单
    if (config.url && requestWhiteList.includes(config.url)) return config;

    // 校验sso的token
    const userInfo = useUserStore.getUibUserInfo;
    if (userInfo?.is_sso === 1) {
      const state = await ssoRefreshToken();
      if (!state) {
        notification.destroy();
        notification.error({
          message: "用户信息已失效, 请重新登录!",
          duration: 3,
        });
        logout(true);
        return config;
      }
    }

    // 校验UIB的token
    await uibRefreshToken(config, options)
      .then((res) => {
        config = res;
      })
      .catch(() => {
        notification.destroy();
        notification.error({
          message: "用户信息已失效, 请重新登录!",
          duration: 3,
        });
        logout(true);
      });
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosResponse, error: any) => {
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || "none";
    const msg: string = response?.data?.error?.message ?? "";
    const err: string = error?.toString?.() ?? "";
    let errMessage = "";

    try {
      if (code === "ECONNABORTED" && message.indexOf("timeout") !== -1) {
        errMessage = `接口请求超时，请刷新页面后稍后重试!`;
      }
      if (err?.includes("Network Error")) {
        errMessage = `网络异常，请检查你的网络是否正常!`;
      }

      if (errMessage) {
        if (errorMessageMode === "modal") {
          createErrorModal({ title: `错误提示`, content: errMessage });
        } else if (errorMessageMode === "message") {
          createMessage.error(errMessage);
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as unknown as string);
    }

    checkStatus(error?.response?.status, msg, errorMessageMode);

    // 添加自动重试机制 保险起见 只针对GET请求
    const retryRequest = new AxiosRetry();
    const { isOpenRetry } = config.requestOptions.retryRequest;
    config.method?.toUpperCase() === RequestEnum.GET &&
      isOpenRetry &&
      // @ts-ignore
      retryRequest.retry(axiosInstance, error);
    return Promise.reject(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    // 深度合并
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        authenticationScheme: "Bearer",
        timeout: 10 * 10000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,

        headers: { "Content-Type": ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: "message",
          // 接口地址
          apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix: urlPrefix,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          retryRequest: {
            isOpenRetry: true,
            count: 5,
            waitTime: 100,
          },
        },
      },
      opt || {}
    )
  );
}
export const defHttp = createAxios();
