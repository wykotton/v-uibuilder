import { defHttp } from "@/utils/http/axios";

enum Api {
  MANAGEMENT_INFO = "/ui-builder/page-info",
  MANAGEMENT_DELETE = "/ui-builder/delete-info",
  PREVIEW_PAGE = "/ui-builder/preview-page",
  PREVIEW_WEBSITE = "/ui-builder/preview-website",
}

/**
 * 管理页面数据
 * @param params
 * @returns
 */
export const managementInfoApi = (params: any) => defHttp.get({ url: Api.MANAGEMENT_INFO, params });
export const managementDeleteApi = (params: any) => defHttp.post({ url: Api.MANAGEMENT_DELETE, params });

/**
 * 预览页面
 * @param params
 * @returns
 */
export const previewPageApi = (params: any) => defHttp.get({ url: Api.PREVIEW_PAGE, params });

/**
 * 预览站点
 * @param params
 * @returns
 */
export const previewWebsiteApi = (params: any) => defHttp.get({ url: Api.PREVIEW_WEBSITE, params });
