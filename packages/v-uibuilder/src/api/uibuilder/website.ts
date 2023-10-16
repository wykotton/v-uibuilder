import { defHttp } from "@/utils/http/axios";

enum Api {
  GET_WEBSITE = "/ui-builder/get-website",
  FIND_WEBSITE = "/ui-builder/find-website",
  SAVE_WEBSITE = "/ui-builder/save-website",
  UPDATE_WEBSITE = "/ui-builder/update-website",
  DELETE_WEBSITE = "/ui-builder/delete-website",
}

/**
 * 获取站点列表
 * @param {*} params
 * @returns
 */
export async function getWebsite(params: any) {
  const results = await defHttp.get({ url: Api.GET_WEBSITE, params });
  return results;
}

/**
 * 查询站点信息
 * @param {*} params
 * @returns
 */
export async function findWebsite(params: any) {
  const results = await defHttp.get({ url: Api.FIND_WEBSITE, params });
  return results;
}

/**
 * 新增站点
 * @param {*} params
 * @returns
 */
export async function saveWebsite(params: any) {
  const results = await defHttp.post({ url: Api.SAVE_WEBSITE, params });
  return results;
}

/**
 * 更新站点
 * @param {*} params
 * @returns
 */
export async function updateWebsite(params: any) {
  const results = await defHttp.post({ url: Api.UPDATE_WEBSITE, params });
  return results;
}

/**
 * 删除站点
 * @param {*} params
 * @returns
 */
export async function deleteWebsite(params: any) {
  const results = await defHttp.post({ url: Api.DELETE_WEBSITE, params });
  return results;
}
