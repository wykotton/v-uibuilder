import { defHttp } from "@/utils/http/axios";

enum Api {
  SYSTEM_CONFIG_INFO = "/ui-builder/system-config",
  SAVE_CONFIG_INFO = "/ui-builder/save-config",
  PREVIEW_CONFIG_INFO = "/ui-builder/preview-config",
}

/**
 * 获取系统配置
 * @param params
 * @returns
 */
export const getConfigInfoApi = (params: any) => defHttp.get({ url: Api.SYSTEM_CONFIG_INFO, params });

/**
 * 获取系统配置,供预览使用，不校验用户权限
 * @param params
 * @returns
 */
export const previewConfigInfoApi = (params: any) => defHttp.get({ url: Api.PREVIEW_CONFIG_INFO, params });

/**
 * 保存系统配置
 * @param params
 * @returns
 */
export const saveConfigInfoApi = (params: any) => defHttp.post({ url: Api.SAVE_CONFIG_INFO, params });
