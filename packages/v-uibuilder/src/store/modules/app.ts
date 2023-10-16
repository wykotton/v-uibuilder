import { EditTypeEnum } from "@/enums/appEnum";
import { resetRouter } from "@/router";
import { store } from "@/store";
import { IComponentWarehouse, IDesignerConfig, IPageModel } from "@/types/IPageModel";
import { warehouseInfo } from "@/types/IQDepot";
import { Persistent } from "@/utils/cache/persistent";
import { defineStore } from "pinia";

export const useAppStore = defineStore({
  id: "app",
  state: (): any => ({
    canvasStyleData: {
      // 页面全局数据
      width: 1920,
      height: 1080,
    },
    editType: EditTypeEnum.PAGE,
    childPageId: "",
    freezeSave: false, // 切换子页面编辑时冻结保存操作
    pageName: "",
    homeLoading: true,
    percentOrAbsolute: "absolute",
    layoutData: {
      middleWidth: 80, // 中间面板宽度
      rightWidth: 20, // 右边面板宽度
      middleTopHeight: 80, // 中间上边面板高度
      middleBottomHeight: 20, // 中间下边面板高度
    },
    themeConfig: {
      themeColors: document.documentElement.style.getPropertyValue("--theme-color"),
      canvasColors: document.documentElement.style.getPropertyValue("--canvas-color"),
      backgroundImage: "",
      isGrid: true,
    },
    isCtrlKey: false, // ctrl按键
    isShiftKey: false, // shift按键
    isSpaceKey: false, // space按键
    isZeroKey: false, // 按键0(非数字键盘)
    isFocus: false, // 页面组件聚焦状态
    scaleNum: 1, // 主画布缩放系数
    pageModel: null,
    designerConfig: null,
    pageInstance: null, // 页面实例数据
    editStatus: false, // 编辑页状态
    innerObserver: null, // 主画布MutationObserver实例
    bottomObserver: null, // 底部画布MutationObserver实例
    warehouses: [], // 仓库列表
    websiteName: "UIBuilder", // 网站名称
    defaultWebsiteName: "UIBuilder", // 默认网站名称
    disableWarehouse: [], // 禁用仓库列表
    bottomContentTab: "1", // 辅助画布tabActiveKey
  }),
  getters: {
    getComponentWarehouse(): IComponentWarehouse[] {
      return this.designerConfig?.component_warehouse ?? [];
    },
  },
  actions: {
    setCanvasStyle(style: Object) {
      this.canvasStyleData = { ...this.canvasStyleData, ...style };
    },
    setLayout(style: object) {
      this.layoutData = { ...this.layoutData, ...style };
    },
    setThemeConfig(config: Object) {
      this.themeConfig = { ...this.themeConfig, ...config };
    },
    setPageName(name: string) {
      this.pageName = name;
    },
    setPercentOrAbsolute(percentOrAbsolute: string) {
      this.percentOrAbsolute = percentOrAbsolute;
    },
    addComponent(component: object) {
      this.componentData.push(component);
    },
    setIsCtrlKey(isCtrlKey: boolean) {
      this.isCtrlKey = isCtrlKey;
    },
    setIsShiftKey(isShiftKey: boolean) {
      this.isShiftKey = isShiftKey;
    },
    setIsSpaceKey(isSpaceKey: boolean) {
      this.isSpaceKey = isSpaceKey;
    },
    setIsZeroKey(isZeroKey: boolean) {
      this.isZeroKey = isZeroKey;
    },
    setIsFocus(isFocus: Boolean) {
      this.isFocus = isFocus;
    },
    setScaleNum(scale: number) {
      this.scaleNum = scale;
    },
    setPageModel(value: IPageModel) {
      this.pageModel = value;
    },
    async resetAllState() {
      resetRouter();
      Persistent.clearAll();
    },
    setDesignerConfig(value: IDesignerConfig) {
      this.designerConfig = value;
    },
    setPageInstance(value: object) {
      this.pageInstance = value;
    },
    setEditStatus(status: boolean) {
      this.editStatus = status;
    },
    setInnerObserver(example: any) {
      this.innerObserver = example;
    },
    setBottomObserver(example: any) {
      this.bottomObserver = example;
    },
    setWarehouses(list: warehouseInfo[]) {
      this.warehouses = list;
    },
    setWebsiteName(name: string) {
      this.websiteName = name;
    },
    setDisableWarehouse(list: string[]) {
      this.disableWarehouse = list;
    },
    setBottomContentTab(value: string) {
      this.bottomContentTab = value;
    },
    setHomeLoading(value: Boolean) {
      this.homeLoading = value;
    },
    setEditType(value: string) {
      this.editType = value;
    },
    setChildPageId(value: string) {
      this.childPageId = value;
    },
    setFreezeSave(value: Boolean) {
      this.freezeSave = value;
    },
  },
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store);
}
