import { defineStore } from "pinia";
import { store } from "@/store";
import { drawerList } from "@/enums/pluginEnum";
import { getAppEnvConfig } from "@/utils/env";

const { VITE_GLOB_DOCS_ADDRESS = "" } = getAppEnvConfig();

export const usePluginStore = defineStore({
  id: "plugin",
  state: (): any => ({
    // 组件库drawer
    comMenu: {
      visible: false,
      fixed: false,
    },
    // 页面库drawer
    pageLibrary: {
      visible: false,
      fixed: false,
    },
    // SchemaJson数据drawer
    schemaJson: {
      visible: false,
      fixed: false,
    },
    // 抽屉打开且固定的状态
    drawerState: false,
    // 元件列表
    componentsList: [],
    // 元件列表
    helpDoc: {
      visible: false,
      url: VITE_GLOB_DOCS_ADDRESS,
    },
    // 项目子页面drawer
    childPage: {
      visible: false,
      fixed: false,
    },
    // 项目页面drawer
    projectPage: {
      visible: false,
      fixed: false,
    },
  }),
  getters: {},
  actions: {
    setDrawerVisible(type: string, value: boolean) {
      this[type].visible = value;
      this.setDrawerState(type);
    },
    setDrawerFixed(type: string, value: boolean) {
      this[type].fixed = value;
      this.setDrawerState(type);
    },
    setDrawerState(type: string) {
      if (this[type].visible && this[type].fixed) {
        this.drawerState = true;
      } else {
        this.drawerState = false;
      }
    },
    setDocVisible(value: boolean) {
      this.helpDoc.visible = value;
    },
    setDocUrl(url: string) {
      this.helpDoc.url = url;
    },
    closeAllDrawer() {
      drawerList.forEach((key: string) => {
        this[key].visible = false;
      });
      this.drawerState = false;
    },
    closeFixedMenu() {
      drawerList.forEach((key: string) => {
        this[key].fixed ? void 0 : (this[key].visible = false);
      });
    },
    setComponentsList(list: Array<{ [key: string]: any }>) {
      this.componentsList = list;
    },
  },
});

// Need to be used outside the setup
export function usePluginStoreWithOut() {
  return usePluginStore(store);
}
