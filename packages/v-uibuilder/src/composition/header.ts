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
import $ from "jquery";
import { CanvasIdEnum } from "@/enums/appEnum";

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
function undoRedoRender() {
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
  pageInfo.componentsArray.forEach((component: ISchema) => {
    const element: any = tempInner.querySelector(`#${component.id}`) || tempBottom.querySelector(`#${component.id}`);
    if (!element || !element.componentModel) return;
    element.componentModel.updateModelEntity(JSON.stringify(component));
    useAppStore.pageModel.add(element.componentModel.model);
    if (pageInfo.selectedComponents.includes(element.id)) {
      useAppStore.pageModel.addSelected([element.id]);
    }
  });
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
  useAppStore.pageModel.selectedComponents.length === 1
    ? changeSetter(useAppStore.pageModel.currentComponent, ["all"])
    : useSettingStore.moveableExample.setElementGuidelines();
  // 更新图层面板
  useSettingStore.setTreeData(getTrees());
  setNeedToExpandKeys();
  useSettingStore.setSelectedKeys(pageInfo.selectedComponents);
}
