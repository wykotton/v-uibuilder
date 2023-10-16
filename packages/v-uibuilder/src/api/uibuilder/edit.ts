import { defHttp } from "@/utils/http/axios";

enum Api {
  SYSTEM_SAVE = "/ui-builder/system-save",
  UPDATE_SYSTEM_SAVE = "/ui-builder/system-update",
  SYSTEM_FIND = "/ui-builder/system-find",
  GET_COMBINATION = "/ui-builder/get-combination",
  SEARCH_COMBINATION = "/ui-builder/search-combination",
  SAVE_COMBINATION = "/ui-builder/save-combination",
  DELETE_COMBINATION = "/ui-builder/delete-combination",
  FIND_COMBINATION = "/ui-builder/find-combination",
  SEARCH_PAGE_WAREHOUSE = "/ui-builder/search-page-warehouse",
  FIND_PAGE_WAREHOUSE = "/ui-builder/find-page-warehouse",
  SAVE_PAGE_WAREHOUSE = "/ui-builder/save-page-warehouse",
  LOAD_PAGE_WAREHOUSE = "/ui-builder/load-page-warehouse",
  DELETE_PAGE_WAREHOUSE = "/ui-builder/delete-page-warehouse",
  GET_CHILD_PAGE = "/ui-builder/get-child-page",
  FIND_CHILD_PAGE = "/ui-builder/find-child-page",
  ADD_CHILD_PAGE = "/ui-builder/add-child-page",
  SAVE_CHILD_PAGE = "/ui-builder/save-child-page",
  DELETE_CHILD_PAGE = "/ui-builder/delete-child-page",
  RENAME_CHILD_PAGE = "/ui-builder/rename-child-page",
}

/**
 * 页面数据查询
 * @param {*} params
 * @returns
 */
export async function systemFind(params: any) {
  const results = await defHttp.get({ url: Api.SYSTEM_FIND, params });
  return results;
}

/**
 * 保存页面数据
 * @param {*} params
 * @returns
 */
export async function saveInfo(params: any) {
  const results = await defHttp.post({ url: Api.SYSTEM_SAVE, params });
  return results;
}

/**
 * 更新保存数据
 * @param {*} params
 * @returns
 */
export async function updateInfo(params: any) {
  const results = await defHttp.post({ url: Api.UPDATE_SYSTEM_SAVE, params });
  return results;
}

/**
 * 获取元件集合列表
 * @param params
 * @returns
 */
export async function getCombinationApi(params: any) {
  const results = await defHttp.get({ url: Api.GET_COMBINATION, params });
  return results;
}

/**
 * 查询元件集合
 * @param params
 * @returns
 */
export async function searchCombinationApi(params: any) {
  const results = await defHttp.get({ url: Api.SEARCH_COMBINATION, params });
  return results;
}

/**
 * 查找元件集合
 * @param params
 * @returns
 */
export async function findCombinationApi(params: any) {
  const results = await defHttp.get({ url: Api.FIND_COMBINATION, params });
  return results;
}

/**
 * 保存元件集合
 * @param params
 * @returns
 */
export async function saveCombinationApi(params: any) {
  const results = await defHttp.post({ url: Api.SAVE_COMBINATION, params });
  return results;
}

/**
 * 查询页面库
 * @param params
 * @returns
 */
export async function searchPageWarehouseApi(params: any) {
  const results = await defHttp.get({ url: Api.SEARCH_PAGE_WAREHOUSE, params });
  return results;
}

/**
 * 获取页面库
 * @param params
 * @returns
 */
export async function findPageWarehouseApi(params: any) {
  const results = await defHttp.get({ url: Api.FIND_PAGE_WAREHOUSE, params });
  return results;
}

/**
 * 保存到页面库
 * @param params
 * @returns
 */
export async function savePageWarehouseApi(params: any) {
  const results = await defHttp.post({ url: Api.SAVE_PAGE_WAREHOUSE, params });
  return results;
}

/**
 * 载入页面
 * @param params
 * @returns
 */
export async function loadPageWarehouseApi(params: any) {
  const results = await defHttp.post({ url: Api.LOAD_PAGE_WAREHOUSE, params });
  return results;
}

/**
 * 删除页面
 * @param params
 * @returns
 */
export async function deletePageWarehouseApi(params: any) {
  const results = await defHttp.post({ url: Api.DELETE_PAGE_WAREHOUSE, params });
  return results;
}

/**
 * 获取项目子页面列表
 * @param params
 * @returns
 */
export async function getChildPageApi(params: any) {
  const results = await defHttp.get({ url: Api.GET_CHILD_PAGE, params });
  return results;
}

/**
 * 查找项目子页面
 * @param params
 * @returns
 */
export async function findChildPageApi(params: any) {
  const results = await defHttp.get({ url: Api.FIND_CHILD_PAGE, params });
  return results;
}

/**
 * 新增项目子页面
 * @param params
 * @returns
 */
export async function addChildPageApi(params: any) {
  const results = await defHttp.post({ url: Api.ADD_CHILD_PAGE, params });
  return results;
}

/**
 * 保存项目子页面
 * @param params
 * @returns
 */
export async function saveChildPageApi(params: any) {
  const results = await defHttp.post({ url: Api.SAVE_CHILD_PAGE, params });
  return results;
}

/**
 * 删除项目子页面
 * @param params
 * @returns
 */
export async function deleteChildPageApi(params: any) {
  const results = await defHttp.post({ url: Api.DELETE_CHILD_PAGE, params });
  return results;
}

/**
 * 重命名项目子页面
 * @param params
 * @returns
 */
export async function renameChildPageApi(params: any) {
  const results = await defHttp.post({ url: Api.RENAME_CHILD_PAGE, params });
  return results;
}
