import { useSettingStoreWithOut } from "@/store/modules/setting";
import { useAppStoreWithOut } from "@/store/modules/app";
import { message, Modal } from "ant-design-vue";
import { deleteEvent } from "./delete";
import { ISchema } from "@/types/IModelSchema";
import { stringify } from "telejson";
import { getTrees, setNeedToExpandKeys } from "./tree";
import { blurSelectCom } from "./tree";
import { checkComponentRoot } from "./page";
import { AutoScrollEnum, CanvasIdEnum } from "@/enums/appEnum";
import { createVNode } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import scrollIntoView from "scroll-into-view-if-needed";
import styleParse from "style-to-object";
import $ from "jquery";
import { awaitTime } from "@/utils/utils";
import { recordSnapshot } from "./header";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

/**
 * 更新设置器和moveable实例
 */
export function changeSetter(model: ISchema, type: Array<string>) {
  if (!model) {
    message.destroy();
    message.error("组件实例数据有误，无法更新设置器!");
    return;
  }
  if (type.includes("attribute") || type.includes("all")) {
    // 更新属性设置器
    const _value = { model: JSON.parse(stringify(model)) };
    const _schema = model.iovSchema.optionsView;
    Object.assign(useSettingStore.attributeSetter, { _schema, _value });
  }
  if (type.includes("style") || type.includes("all")) {
    // 更新样式设置器
    useSettingStore.styleSetter.setAttribute("value", model.initStyle);
  }
  if (type.includes("domEvent") || type.includes("all")) {
    // 更新DOM事件设置器
    const _value = JSON.parse(stringify(model._onDOMEvent)) || {};
    Object.assign(useSettingStore.eventSetter, { _value });
  }
  if (type.includes("moveable") || type.includes("all")) {
    // 更新moveable实例
    useSettingStore.moveableExample.setElementGuidelines();
  }
  // 更新集合状态
  if (model?.iovSchema?.componentName === "q-combination") {
    useSettingStore.setIsCombination(true);
  } else {
    useSettingStore.setIsCombination(false);
  }
}

/**
 * 检查元件设计时和运行时状态
 * 更新moveable对象
 * @param contextType
 */
export function checkUpContextType(contextType: boolean) {
  if (contextType) {
    // 清除moveable对象
    useSettingStore.moveableExample.clearAllTarget();
  } else {
    const id = useAppStore.pageModel?.selectedComponents?.[0]?.id;
    if (id) {
      // 添加moveable对象
      changeMoveableTarget(id);
    }
  }
}

/**
 * 变更moveable的target
 * @param id
 */
export function changeMoveableTarget(id: string) {
  const component = document.querySelector(`#${id}`);
  const root = checkComponentRoot(id);
  switch (root) {
    case CanvasIdEnum.INNER:
      useSettingStore.moveableExample.setTopTarget(component);
      break;
    case CanvasIdEnum.BOTTOM:
      useSettingStore.moveableExample.setBottomTarget(component);
      break;
  }
}

/**
 * 操作菜单
 * @param id 操作项id
 */
export function handleEvents(id: number) {
  switch (id) {
    case 1:
      deleteEvent();
      break;
    case 2:
      setZIndex("increase");
      break;
    case 3:
      setZIndex("reduce");
      break;
  }
}

/**
 * 设置组件层级
 * @param type 增加|减小
 * @returns
 */
function setZIndex(type = "") {
  if (!useAppStore?.pageModel?.selectedComponents.length) return;
  if (type === `increase`) {
    useAppStore.pageModel.selectedComponents.forEach((component: ISchema) => {
      const element = $(`#${component.id}`);
      if (element.length !== 1) return;
      const zIndex = element.css("z-index");
      if (zIndex === `auto`) {
        element.css("z-index", 1);
      } else {
        element.css("z-index", Number(zIndex) + 1);
      }
      useChangeInitStyle(element[0], ["z-index"], useAppStore.pageModel.selectedComponents.length === 1);
    });
    return;
  }
  useAppStore.pageModel.selectedComponents.forEach((component: ISchema) => {
    const element = $(`#${component.id}`);
    if (element.length !== 1) return;
    const zIndex = element.css("z-index");
    if (zIndex === `auto` || Number(zIndex) === 0) {
      element.css("z-index", 0);
    } else {
      element.css("z-index", Number(zIndex) - 1);
    }
    useChangeInitStyle(element[0], ["z-index"], useAppStore.pageModel.selectedComponents.length === 1);
  });
}

/**
 * 清除选中组件tag
 * @param id
 */
export function clearSelectedTag(id: string) {
  const ids = [id];
  // 移除hover样式
  blurSelectCom(id);
  // 移除当前组件选中数据
  useAppStore.pageModel.removeSelected(ids);
  // 更新图层面板选中数据
  const keys = useAppStore.pageModel.selectedComponents.map((component: ISchema) => {
    return component.id;
  });
  useSettingStore.setSelectedKeys(keys);
  if (keys.length === 1) {
    const model = useAppStore.pageModel?.currentComponent;
    if (model) {
      // 更新设置器和moveable实例
      changeSetter(model, ["all"]);
    } else {
      message.error("无法查找到组件实例数据！");
    }
  } else {
    // 更新moveable实例
    useSettingStore.moveableExample.setElementGuidelines();
  }
}

/**
 * 点击选中组件tag
 * @param id
 */
export function clickSelectedTag(id: string) {
  const ids = [id];
  // 移除hover样式
  blurSelectCom(id);
  // 更新组件选中数据
  useAppStore?.pageModel.clearSelected();
  useAppStore?.pageModel.addSelected(ids);
  // 更新图层面板选中项
  useSettingStore.setSelectedKeys(ids);
  // 更新设置器
  changeSetter(useAppStore?.pageModel.currentComponent, ["all"]);
}

/**
 * 变更组件initStyle的指定数据
 * @param cssText
 * @param initStyle
 */
export function changeInitStyle(cssText: string, initStyle: string, keys: string[]) {
  const cssTextObject = styleParse(cssText) as any;
  const initStyleObject = styleParse(initStyle) as any;
  keys.forEach((key) => {
    cssTextObject[key] ? (initStyleObject[key] = cssTextObject[key]) : void 0;
  });
  let styleStr = "";
  for (const key in initStyleObject) {
    styleStr += `${key}: ${initStyleObject[key]};`;
  }
  return styleStr;
}

/**
 * 更新组件initStyle
 * @param element 组件元素
 * @param keys 需要更新的key
 * @param changeSetter 是否更新styleSetter
 */
export function useChangeInitStyle(element: any, keys: string[], changeSetter: boolean) {
  // 更新组件initStyle
  const cssText = element.style.cssText;
  const initStyle = element.componentModel.model.initStyle;
  const newInitStyle = changeInitStyle(cssText, initStyle, keys);
  element.componentModel.model.initStyle = newInitStyle;
  // 更新样式设置器
  if (changeSetter && useSettingStore.styleSetter) useSettingStore.styleSetter.setAttribute("value", newInitStyle);
}

/**
 * 组件切换容器
 * @param slotName
 * @param target
 */
export function changeContainer(slotName: string, target: HTMLElement, left: number, top: number) {
  if (!target) {
    message.error("组件不存在!");
    return;
  }
  const id = useAppStore.pageModel.currentComponent.id;
  const component = document.querySelector(`#${id}`) as any;
  if ($(target).parents(`#${id}`).length || component?.id === target.id) {
    message.destroy();
    message.warning("不可放入组件自身容器内部！");
    return;
  }
  if (component?.parentElement?.id === target.id && component.slot === slotName) {
    message.destroy();
    message.warning("组件已在当前容器内部！");
    return;
  }
  // 向目|标组件插入当前组件
  slotName ? (component.slot = slotName) : (component.slot = "");
  target.appendChild(component);
  // 变更组件坐标
  component.style.left = (left || 0) + "px";
  component.style.top = (top || 0) + "px";
  // 更新组件initStyle
  const cssText = component.style.cssText;
  const initStyle = component.componentModel.model.initStyle;
  const newInitStyle = changeInitStyle(cssText, initStyle, ["left", "top"]);
  useAppStore.pageModel.currentComponent.initStyle = newInitStyle;
  // 更新设置器和moveable实例
  changeSetter(useAppStore.pageModel.currentComponent, ["all"]);
  // 更新moveable辅助框，防止产生偏移
  useSettingStore.moveableExample.updateMoveable();
  // 更新图层面板
  useSettingStore.setTreeData(getTrees());
}

/**
 * 清空画布(主画布/辅助画布)
 * @param type
 */
export function useCleanUpCanvas(type: string) {
  let id = "";
  let title = "";
  switch (type) {
    case CanvasIdEnum.INNER:
      id = CanvasIdEnum.INNER;
      title = "确定清空主画布吗?";
      break;
    case CanvasIdEnum.BOTTOM:
      id = CanvasIdEnum.BOTTOM;
      title = "确定清空辅助画布吗?";
      break;
  }
  Modal.confirm({
    title,
    icon: createVNode(ExclamationCircleOutlined),
    okText: "确定",
    cancelText: "取消",
    onOk() {
      cleanUpElementChildren(id);
    },
  });
}

/**
 * 清除指定节点的子组件
 * @param id
 * @returns
 */
function cleanUpElementChildren(id: string) {
  if (!id) return;
  const element = document.querySelector(`#${id}`);
  if (element) {
    const components = Array.from(element.querySelectorAll(".draggable2"));
    components.forEach((element) => {
      const id = element.id;
      if (id) {
        useAppStore.pageModel?.removeSelected([id]);
        useAppStore.pageModel?.delete(id);
      }
    });
    // 更新moveable实例
    useSettingStore.moveableExample.setElementGuidelines();
    // 更新图层面板
    useSettingStore.setTreeData(getTrees());
    // 添加快照
    recordSnapshot();
  }
}

/**
 * 元件聚焦和图层面板聚焦
 * @param type
 * @returns
 */
export async function autoScrollCanvas(type: string) {
  if (useAppStore.isCtrlKey) return;
  if (useAppStore.pageModel?.selectedComponents.length === 1) {
    const id = useAppStore.pageModel?.currentComponent?.id;
    if (!id) return;
    let component = undefined;
    let boundary = null;
    switch (type) {
      case AutoScrollEnum.COMPONENT:
        component = document.querySelector(`#${id}`);
        if (!component) {
          message.destroy();
          message.error("未找到元件, 无法进行聚焦!");
          return;
        }
        const root = checkComponentRoot(id);
        if (!root) return;
        const layoutData = {
          middleTopHeight: useAppStore.layoutData.middleTopHeight,
          middleBottomHeight: useAppStore.layoutData.middleBottomHeight,
        };
        if (root === CanvasIdEnum.INNER) {
          if (layoutData.middleBottomHeight > 20) {
            layoutData.middleTopHeight = 80;
            layoutData.middleBottomHeight = 20;
          }
          boundary = document.querySelector(`.auto-size-inner-dropzone`);
        } else {
          if (layoutData.middleTopHeight > 20) {
            layoutData.middleTopHeight = 20;
            layoutData.middleBottomHeight = 80;
          }
          boundary = document.querySelector(`.auto-size-bottomcontent`);
          // 所选元件在辅助画布，就切换到辅助画布tab
          useAppStore.setBottomContentTab("1");
        }
        useAppStore.setLayout(layoutData);
        await awaitTime(150);
        break;
      case AutoScrollEnum.LAYER:
        setNeedToExpandKeys();
        await awaitTime(150);
        component = document.querySelector(`#${id}_tree`);
        if (!component) {
          message.destroy();
          message.error("未找到图层面板节点, 无法进行聚焦!");
          return;
        }
        boundary = document.querySelector(`#right-menucontent`);
        break;
    }
    if (component) {
      scrollIntoViewArea(component, boundary);
    }
  }
}

/**
 * 将指定节点滚动到可见区域中央
 * @param component
 * @param boundary
 */
function scrollIntoViewArea(component: Element, boundary: Element | null) {
  if (!component) return;
  scrollIntoView(component, {
    scrollMode: "if-needed",
    behavior: "smooth",
    block: "center",
    inline: "center",
    boundary,
  });
}
