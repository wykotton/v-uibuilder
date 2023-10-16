import { useSettingStoreWithOut } from "@/store/modules/setting";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useUserStoreWithOut } from "@/store/modules/user";
import { isPlane, formatStyleUnit } from "./alignTools";
import { cloneDeep, isEqual, isNumber, isString } from "lodash-es";
import { dragDrop } from "@/utils/dragdrop/index";
import { createHashId } from "@/utils/uuid";
import { message } from "ant-design-vue";
import { ISchema } from "@/types/IModelSchema";
import { changeInitStyle, changeSetter } from "./setting";
import { getTrees } from "./tree";
import { saveCombinationApi } from "@/api/uibuilder/edit";
import { stringify } from "telejson";
import { usePluginStoreWithOut } from "@/store/modules/plugin";
import { IQDepotOptions } from "@/types/IQDepot";
import { ICombinationOptions } from "@/types/ICombination";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();
const useUserStore = useUserStoreWithOut();
const usePluginStore = usePluginStoreWithOut();

/**
 * 组件组合
 */
export async function useCombination() {
  if (useAppStore?.pageModel?.selectedComponents.length <= 1) return;
  if (!isPlane()) {
    message.destroy();
    message.warning("只能组合同一平面内的组件!");
    return;
  }
  // const childrenId = useAppStore?.pageModel?.currentComponent.id;
  // const childrenElement = document.querySelector(`#${childrenId}`);
  // if (childrenElement?.parentElement?.tagName === "Q-COMBINATION") {
  //   message.destroy();
  //   message.warning("元件已在集合内, 无需重复合并!");
  //   return;
  // }
  const { rect, slotName, parentElement } = getCombinationRect();
  if (!rect) {
    message.destroy();
    message.error("集合矩阵信息获取失败!");
    return;
  }
  const componentName = "q-combination";
  useAppStore.pageModel?.pageModel
    .whenDefinedComponent(componentName)
    .then(() => {
      const data = { rect, slotName, parentElement };
      const element = createCombination(data);
      setCombinationChildren(element);
      if ((element as any)?.componentModel?.model) {
        dragDrop.updateExampleData((element as any).componentModel.model);
      }
    })
    .catch(() => {
      message.destroy();
      message.error("元件集合未注册, 请检查元件库!");
    });
}

/**
 * 获取集合的矩阵信息
 */
function getCombinationRect() {
  let rect = null;
  let slotName = "";
  let parentElement = null;
  let components = [];
  if (useSettingStore.moveableExample.moveableTop.target) {
    components = useSettingStore.moveableExample.moveableTop.target;
    rect = useSettingStore.moveableExample.moveableTop.getRect();
    slotName = components[0].slot;
    parentElement = components[0].parentElement;
  } else if (useSettingStore.moveableExample.moveableBottom.target) {
    components = useSettingStore.moveableExample.moveableBottom.target;
    rect = useSettingStore.moveableExample.moveableBottom.getRect();
    slotName = components[0].slot;
    parentElement = components[0].parentElement;
  }
  const minLeft = Math.min(...components.map((element: HTMLElement) => formatStyleUnit(element, "left")));
  const minTop = Math.min(...components.map((element: HTMLElement) => formatStyleUnit(element, "top")));
  rect?.left ? (rect.left = minLeft) : void 0;
  rect?.top ? (rect.top = minTop) : void 0;
  return { rect, slotName, parentElement };
}

/**
 * 创建集合
 * @param data
 * @returns
 */
function createCombination(data: { [key: string]: any }) {
  const { rect, slotName, parentElement } = data;
  const { left, top, width, height } = rect;
  const element = document.createElement("q-combination");
  element.slot = slotName;
  parentElement.appendChild(element);
  const cssText = `position: absolute;left: ${left}px;top: ${top}px;width: ${width}px;height: ${height}px;`;
  const initStyle = (element as any)?.componentModel?.model?.initStyle;
  const newInitStyle = changeInitStyle(cssText, initStyle, ["position", "left", "top", "width", "height"]);
  (element as any).componentModel.model.initStyle = newInitStyle;
  element.classList.add("draggable2");
  element.id = createHashId(12, element.tagName);
  element.setAttribute("data-element-type", element.tagName);
  return element;
}

/**
 * 设置集合的子元素
 * @param element 子元素
 */
function setCombinationChildren(element: HTMLElement) {
  const replaceUnit = (str: string) => Number(str.replace("px", "").replace("%", ""));
  const left = replaceUnit(element.style.left);
  const top = replaceUnit(element.style.top);
  useAppStore.pageModel.selectedComponents.forEach((model: ISchema) => {
    const component: any = document.querySelector(`#${model.id}`);
    const cssText = `left: ${replaceUnit(component.style.left) - left}px;top: ${
      replaceUnit(component.style.top) - top
    }px;`;
    const initStyle = component.componentModel.model.initStyle;
    component.componentModel.model.initStyle = changeInitStyle(cssText, initStyle, ["left", "top"]);
    component.slot = "";
    element.appendChild(component);
  });
}

/**
 * 拆分组合
 */
export function useCombinationSplit() {
  const id = useAppStore?.pageModel?.currentComponent.id;
  const element = document.querySelector(`#${id}`) as HTMLElement;
  if (!element) {
    message.destroy();
    message.error("元件集合实例获取失败!");
    return;
  }
  const focusElement = setSplitChildren(element);
  // 更新pageModel
  useAppStore?.pageModel.delete(id);
  useAppStore?.pageModel.clearSelected();
  useAppStore?.pageModel.addSelected(focusElement);
  if (focusElement.length === 1) {
    // 更新设置器
    changeSetter(useAppStore.pageModel?.currentComponent, ["all"]);
  } else {
    // 多选时，不更新设置器，只更新moveable实例
    changeSetter(useAppStore.pageModel?.currentComponent, ["moveable"]);
  }
  // 更新图层面板
  useSettingStore.setTreeData(getTrees());
  useSettingStore.setSelectedKeys(focusElement);
}

/**
 * 设置拆分的子元素
 * @param element 子元素
 */
function setSplitChildren(element: HTMLElement) {
  const replaceUnit = (str: string) => Number(str.replace("px", "").replace("%", ""));
  const left = replaceUnit(element.style.left);
  const top = replaceUnit(element.style.top);
  const slotName = element.slot;
  const parentElement = element.parentElement as HTMLElement;
  const focusElement: Array<string> = [];
  Array.from(element.children).forEach((component: any) => {
    if (!component.classList.contains("draggable2")) return;
    focusElement.push(component.id);
    const cssText = `left: ${replaceUnit(component.style.left) + left}px;top: ${
      replaceUnit(component.style.top) + top
    }px;`;
    const initStyle = component.componentModel.model.initStyle;
    component.componentModel.model.initStyle = changeInitStyle(cssText, initStyle, ["left", "top"]);
    slotName ? (component.slot = slotName) : (component.slot = "");
    parentElement.appendChild(component);
  });
  return focusElement;
}

/**
 * 保存元件集合
 */
export async function useSaveCombination(info: { [key: string]: string }, combinationType: string) {
  const { type = "", text = "" } = info;
  const id = useAppStore?.pageModel?.currentComponent.id;
  const element = document.querySelector(`#${id}`) as any;
  if (!element) {
    message.destroy();
    message.error("元件集合实例获取失败!");
    return;
  }
  const tempModel = cloneDeep(element.componentModel.model);
  Reflect.deleteProperty(tempModel, "id");
  const data = [
    {
      componentName: "my-component",
      text,
      type,
      group: combinationType === "user" ? ["我的元件"] : ["公共元件"],
      options: JSON.parse(stringify(tempModel)),
      children: getCombinationTree(element),
    },
  ];
  const params = { userId: combinationType === "user" ? useUserStore.getUibUserInfo.id : "", data };
  const results = await saveCombinationApi(params);
  return results;
}

/**
 * 获取元件集合treeData
 */
function getCombinationTree(element: HTMLElement) {
  const treeData: any = [];
  const children = Array.from(element.children);
  if (children.length) {
    children.forEach((child: any) => {
      if (child.classList.contains("draggable2") && child.componentModel) {
        const model = cloneDeep(child.componentModel.model);
        Reflect.deleteProperty(model, "id");
        const tempData = {
          options: JSON.parse(stringify(model)),
          slotName: child.slot,
          children: getCombinationTree(child),
        };
        treeData.push(tempData);
      }
    });
  }
  return treeData;
}

/**
 * 检查元件集合子组件是否存在
 * @param component
 */
export async function checkCombinationComponent(component: ICombinationOptions) {
  let notFind = false;
  const checkComponent = async (info: ICombinationOptions) => {
    if (isString(info.options)) info.options = JSON.parse(info.options);
    if (isString(info.children)) info.children = JSON.parse(info.children);
    let {
      options: {
        iovSchema: { componentName = "", group = [], text = "" },
      },
      children = [],
    } = info;
    if (!componentName) {
      notFind = true;
      return;
    }
    isString(group) ? (group = JSON.parse(group)) : void 0;
    if (!customElements.get(componentName)) {
      const componentIndex = usePluginStore.componentsList.findIndex(
        (item: IQDepotOptions) =>
          item.componentName === componentName && isEqual(item.group, group) && item.text === text
      );
      if (componentIndex === -1) {
        notFind = true;
        return;
      }
      const component = cloneDeep(usePluginStore.componentsList[componentIndex]);
      await useAppStore.pageModel.pageModel.defineCustomWebcomponent(component);
    }
    children.forEach((item: ICombinationOptions) => {
      checkComponent(item);
    });
  };
  await checkComponent(component);
  return notFind;
}

/**
 * 渲染元件集合
 * @param component
 */
export function createCombinationComponent(
  component: ICombinationOptions,
  insetElement: HTMLElement,
  left: number,
  top: number
) {
  const createComponent = (info: ICombinationOptions, parentElement: HTMLElement, left?: number, top?: number) => {
    let { options, slotName, children = [] } = info;
    if (isString(options)) options = JSON.parse(options);
    if (isString(children)) children = JSON.parse(children);
    const {
      iovSchema: { componentName = "" },
    } = options;
    const element = document.createElement(componentName) as any;
    if (!element) {
      message.error("元件创建失败!");
      return;
    }
    // 兼容DI Angular组件创建后不初始化的问题
    if (element && !element.componentModel && element.connectedCallback) {
      element?.connectedCallback();
      element?.componentModel?.model?.lifeCycle?.updated(element, options, "initBaseModel");
      Reflect.deleteProperty(options, "iovSchema");
    }
    element.componentModel.updateModelEntity(JSON.stringify(options));
    if (slotName) element.slot = slotName;
    parentElement.appendChild(element);
    const componentModel = dragDrop.powerByComponent(element, left, top);
    if (componentModel?.model) {
      if (isNumber(left) && isNumber(top)) {
        useAppStore.pageModel.pageModel.setComponentsPageModel(componentModel.model);
        // 更新组件选中数据
        useAppStore.pageModel?.clearSelected();
        useAppStore.pageModel?.addSelected([componentModel.model.id]);
        // 更新设置器和moveable实例
        changeSetter(componentModel.model, ["all"]);
        // 更新图层面板选中
        useSettingStore.setSelectedKeys([componentModel.model.id]);
      } else {
        useAppStore.pageModel.pageModel.setComponentsPageModel(componentModel.model);
      }
    } else {
      message.destroy();
      message.error("组件model创建出错!");
    }
    children.forEach((item: ICombinationOptions) => {
      createComponent(item, element);
    });
  };
  createComponent(component, insetElement, left, top);
}
