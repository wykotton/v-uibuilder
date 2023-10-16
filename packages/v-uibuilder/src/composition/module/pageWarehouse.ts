import { message } from "ant-design-vue";
import { useUserStoreWithOut } from "@/store/modules/user";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { usePluginStoreWithOut } from "@/store/modules/plugin";
import { CanvasIdEnum } from "@/enums/appEnum";
import { findPageWarehouseApi } from "@/api/uibuilder/edit";
import {
  handleTheme,
  initUndoRedo,
  noticeWarehouses,
  retryException,
  silentClearCanvas,
  useResetTree,
} from "@/composition/index";
import BootStrap from "@/utils/designer/BootStrap";
import { IPageModel } from "@/types/IPageModel";

// pinia
const useUserStore = useUserStoreWithOut();
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();
const usePluginStore = usePluginStoreWithOut();

/**
 * 获取页面库的页面数据
 * @param id
 * @returns
 */
export async function getPageWarehouse(id: string, pageId: string, emit: string) {
  const data = await findPageWarehouseApi({ ids: [id] });
  const {
    results,
    info: { msg = "" },
  } = data.data;
  if (msg !== "success") {
    message.destroy();
    message.error("页面数据查找失败, 请重试!");
    return;
  }
  if (!results.length) {
    message.destroy();
    message.error("页面数据不存在!");
    return;
  }
  importPageInfo(results[0], pageId, emit);
}

/**
 * 导入页面库页面数据
 * @param info
 * @param pageId
 * @param emit
 * @returns
 */
export async function importPageInfo(info: any, pageId: string, emit: string) {
  if (!pageId) {
    message.destroy();
    message.error("页面实例id不存在, 无法进行操作!");
    return;
  }
  const userInfo = useUserStore.getUibUserInfo;
  if (!userInfo?.sso_user_id) {
    message.destroy();
    message.info("该页面非同一套用户数据搭建,可能存在问题,请关注控制台!");
    // return;
  }
  const { custom_model } = info;
  if (custom_model) {
    useAppStore.setHomeLoading(true);
    useAppStore.setFreezeSave(true);
    silentClearCanvas();
    handleTheme(info, emit);
    const tempDesignerPage = JSON.parse(custom_model);
    const options = {
      root: `#${CanvasIdEnum.INNER}`,
      config: tempDesignerPage,
      pluginRoot: `#${CanvasIdEnum.BOTTOM}`,
    };
    const bootStrap = new BootStrap(options);
    const pageModel = bootStrap as unknown as Promise<IPageModel>;
    pageModel.then((data) => {
      // 设置pageModel
      useAppStore.setPageModel(Object.preventExtensions(data));
      // 初始化撤销重做
      initUndoRedo();
      // 重置图层面板
      useResetTree();
      // 更新moveable实例
      useSettingStore.moveableExample.setElementGuidelines();
      // 通知各个子仓库
      noticeWarehouses();
      // 元件初始化异常重试
      retryException();
      setTimeout(() => {
        useAppStore.setHomeLoading(false);
        useAppStore.setFreezeSave(false);
        usePluginStore.closeFixedMenu();
      }, 0);
    });
  }
  // const { custom_model, theme } = info;
  // const data = { custom_model, theme, id, userId: userInfo.id };
  // const results = await loadPageWarehouseApi(data);
  // const {
  //   info: { msg = "" },
  // } = results.data;
  // if (msg !== "success") {
  //   message.destroy();
  //   message.error("页面载入失败, 请重试!");
  //   return;
  // }
  // location.reload();
}
