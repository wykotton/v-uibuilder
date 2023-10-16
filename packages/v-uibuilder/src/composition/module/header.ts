import { getPageInfo } from "./page";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useHeaderStoreWithOut } from "@/store/modules/header";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { cloneDeep } from "lodash-es";
import { useManualRefHistory } from "@vueuse/core";
import { ISchema } from "@/types/IModelSchema";
import { storeToRefs } from "pinia";
import { message } from "ant-design-vue";
import { getTrees, setNeedToExpandKeys } from "./tree";
import { changeSetter } from "./setting";
import { CanvasIdEnum } from "@/enums/appEnum";
import { getTheme, updateTheme } from "@/api/sys/user";
import { ChangeSetterEnum } from "@/enums/settingEnum";
import $ from "jquery";

// pinia
const useAppStore = useAppStoreWithOut();
const useHeaderStore = useHeaderStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

/**
 * 初始化撤消重做
 */
export function initUndoRedo() {
  setSnapshotData();
  const { snapshotData } = storeToRefs(useHeaderStore);
  const refHistory = useManualRefHistory(snapshotData, { clone: cloneDeep, capacity: 10 });
  useHeaderStore.setManualRefHistory(Object.preventExtensions(refHistory));
}

/**
 * 设置快照数据
 */
function setSnapshotData() {
  const pageInfo = getPageInfo();
  if (!pageInfo) return;
  if (useAppStore?.pageModel) {
    const selectedComponents = useAppStore.pageModel.selectedComponents.map((component: ISchema) => {
      return component.id;
    });
    pageInfo.selectedComponents = selectedComponents;
  } else {
    pageInfo.selectedComponents = [];
  }
  useHeaderStore.setSnapshotData(pageInfo);
}

/**
 * 添加快照
 */
export function recordSnapshot() {
  setSnapshotData();
  useHeaderStore.manualRefHistory.commit();
}

/**
 * 使用撤销
 */
export function useUndo() {
  if (!useHeaderStore?.manualRefHistory?.canUndo?.value) return;
  useHeaderStore.manualRefHistory.undo();
  undoRedoRender();
}

/**
 * 使用重做
 */
export function useRedo() {
  if (!useHeaderStore.manualRefHistory?.canRedo?.value) return;
  useHeaderStore.manualRefHistory.redo();
  undoRedoRender();
}

/**
 * 撤消重做后渲染
 */
async function undoRedoRender() {
  const pageInfo = useHeaderStore.manualRefHistory?.history?.value[0]?.snapshot;
  if (!pageInfo || !useAppStore?.pageModel) return;
  const innerDropzone = document.querySelector(`#${CanvasIdEnum.INNER}`);
  const bottomDropzone = document.querySelector(`#${CanvasIdEnum.BOTTOM}`);
  if (!innerDropzone || !bottomDropzone) {
    message.destroy();
    message.error("未获取到画布节点!");
    return;
  }
  // 清除pageModel数据
  useAppStore.pageModel.clear();
  useAppStore.pageModel.clearSelected();
  // 创建临时组件
  const tempInner = document.createElement("div");
  const tempBottom = document.createElement("div");
  tempInner.innerHTML = pageInfo.dynamicHTML;
  tempBottom.innerHTML = pageInfo.pluginHTML;
  for await (const component of pageInfo.componentsArray) {
    const element: any = tempInner.querySelector(`#${component.id}`) || tempBottom.querySelector(`#${component.id}`);
    // 兼容DI Angular组件创建后不初始化的问题
    if (element && !element.componentModel && element.connectedCallback) {
      element.connectedCallback?.();
      element.componentModel.model?.lifeCycle?.updated?.(element, component, "initBaseModel");
      Reflect.deleteProperty(component, "iovSchema");
    }
    if (!element || !element.componentModel) continue;
    element?.componentModel?.updateModelEntity?.(JSON.stringify(component));
    useAppStore.pageModel.add(element.componentModel.model);
    if (pageInfo.selectedComponents.includes(element.id)) {
      await useAppStore.pageModel.addSelected([element.id]);
    }
  }
  // 清除画布所有组件
  $(".draggable2").remove();
  // 添加组件到画布
  Array.from(tempInner.children).forEach((item) => {
    innerDropzone.appendChild(item);
  });
  Array.from(tempBottom.children).forEach((item) => {
    bottomDropzone.appendChild(item);
  });
  // 更新设置器和moveable实例
  if (useAppStore.pageModel.selectedComponents.length === 1) {
    changeSetter(useAppStore.pageModel.currentComponent, [ChangeSetterEnum.ALL]);
  }
  useSettingStore.moveableExample.setElementGuidelines();
  // 更新图层面板
  useSettingStore.setTreeData(getTrees());
  setNeedToExpandKeys();
  useSettingStore.setSelectedKeys(pageInfo.selectedComponents);
}

/**
 * 初始化用户主题配置
 */
export function initThemeConfig(setCanvas = false) {
  getTheme().then((res) => {
    const {
      results,
      info: { msg = "" },
    } = res.data;
    if (msg !== "success") return;
    useAppStore.setThemeConfig(results);
    if (results.themeColors) {
      document.documentElement.style.setProperty("--theme-color", results.themeColors);
    }
    if (results.canvasColors) {
      document.documentElement.style.setProperty("--canvas-color", results.canvasColors);
    }
    setCanvas ? setCanvasBackground() : void 0;
  });
}

/**
 * 处理canvas背景操作
 */
export function handleCanvasBackground() {
  updateTheme({ theme: useAppStore.themeConfig }).then((res) => {
    const {
      info: { msg = "" },
    } = res.data;
    if (msg !== "success") {
      message.destroy();
      message.error("主题变更失败!");
      return;
    }
    setCanvasBackground();
  });
}

/**
 * 设置canvas背景
 */
export function setCanvasBackground() {
  const innerDropzone = document.querySelector(`#${CanvasIdEnum.INNER}`) as HTMLElement;
  if (!innerDropzone) return;
  // 优先显示背景图片
  if (useAppStore.themeConfig.backgroundImage) {
    innerDropzone.style.backgroundImage = useAppStore.themeConfig.backgroundImage;
    return;
  }
  // 显示网格
  if (useAppStore.themeConfig.isGrid) {
    innerDropzone.style.backgroundImage = `
      repeating-linear-gradient( 
      180deg,
      rgba(36, 41, 46, 0.25) 0px,
      rgba(36, 41, 46, 0.25) 0px,
      transparent ${1 / useAppStore.scaleNum}px, 
      transparent ${15 / useAppStore.scaleNum}px ),
      repeating-linear-gradient(90deg,
      rgba(36, 41, 46, 0.25) 0px,
      rgba(36, 41, 46, 0.25) 0px,
      transparent ${1 / useAppStore.scaleNum}px,
      transparent ${15 / useAppStore.scaleNum}px )
    `;
    return;
  }
  innerDropzone.style.backgroundImage = "none";
}

/**
 * 画布变更大小后更新Moveable和Guides实例
 */
export function changeMoveableAndGuides() {
  // 更新moveable边界
  const bounds = {
    left: 0,
    top: 0,
    right: useAppStore.canvasStyleData.width,
    bottom: useAppStore.canvasStyleData.height,
  };
  if (useSettingStore.moveableExample.moveableTop) {
    useSettingStore.moveableExample.moveableTop.bounds = bounds;
  }
  // 更新主画布标尺
  setTimeout(() => {
    useSettingStore.guides?.horizontalGuides.resize();
    useSettingStore.guides?.verticalGuides.resize();
  }, 0);
}

/**
 * 重置页面布局
 */
export function resetLayout() {
  useAppStore.setLayout({
    middleWidth: 80,
    rightWidth: 20,
    middleTopHeight: 80,
    middleBottomHeight: 20,
  });
}

/**
 * 重置主题
 */
export function resetThemeConfig() {
  useAppStore.setThemeConfig({
    themeColors: "#409eff",
    canvasColors: "#ffffff",
    backgroundImage: "",
    isGrid: true,
  });
  updateTheme({ theme: useAppStore.themeConfig }).then((res) => {
    const {
      info: { msg = "" },
    } = res.data;
    if (msg !== "success") {
      message.destroy();
      message.error("主题重置失败!");
      return;
    }
    document.documentElement.style.setProperty("--theme-color", "#409eff");
    document.documentElement.style.setProperty("--canvas-color", "#ffffff");
    setCanvasBackground();
  });
}
