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
import { usePluginStoreWithOut } from "@/store/modules/plugin";
import { IQDepotOptions } from "@/types/IQDepot";
import { ICombinationOptions } from "@/types/ICombination";
import { stringifyDeep } from "@/utils";
import { ChangeSetterEnum, recoverTypesEnum } from "@/enums/settingEnum";
import { IComponent } from "@/types/IComponent";
import { IAttributeConfig, IAttributeInfo, IReceive, IRouterConfig, IRouterInfo } from "@/types/IRouterConfig";
import { checkComponentDefined, getComponents } from "./plugin";
import { CanvasIdEnum } from "@/enums/appEnum";
import { handleAttributeBind } from "@zzjz/v-component/src/util/attr-bind";
import DesignerPage from "@/utils/designer/DesignerPage";

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
        dragDrop.updateExampleData((element as any).componentModel);
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
  rect?.left && (rect.left = minLeft);
  rect?.top && (rect.top = minTop);
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
export async function useCombinationSplit() {
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
  await useAppStore?.pageModel.addSelected(focusElement);
  if (focusElement.length === 1) {
    // 更新设置器
    changeSetter(useAppStore.pageModel?.currentComponent, [ChangeSetterEnum.ALL]);
  } else {
    // 多选时，不更新设置器，只更新moveable实例
    changeSetter(useAppStore.pageModel?.currentComponent, [ChangeSetterEnum.MOVEABLE]);
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
    (slotName && (component.slot = slotName)) || (component.slot = "");
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
  const element = document.querySelector(`#${id}`) as unknown as IComponent;
  if (!element) {
    message.destroy();
    message.error("元件集合实例获取失败!");
    return;
  }
  const tempModel = cloneDeep(element.componentModel.model);
  const { ids, combinationTree } = getCombinationTree(element);
  const routerConfig = getCombinationRouter(ids);
  const attrBind = getCombinationAttrBind(ids);
  const data = [
    {
      componentName: "my-component",
      text,
      type,
      group: combinationType === "user" ? ["我的元件"] : ["公共元件"],
      options: JSON.parse(stringifyDeep(tempModel)),
      router: routerConfig,
      attrBind,
      children: combinationTree,
    },
  ];
  const params = { userId: combinationType === "user" ? useUserStore.getUibUserInfo.id : "", data };
  const results = await saveCombinationApi(params);
  return results;
}

/**
 * 获取元件集合treeData
 */
function getCombinationTree(element: IComponent) {
  const treeData: any = [];
  const idsArr: string[] = [];
  const children = Array.from(element.children);
  if (children.length) {
    children.forEach((child: any) => {
      if (child.classList.contains("draggable2") && child.componentModel) {
        const model = cloneDeep(child.componentModel.model);
        const { ids, combinationTree } = getCombinationTree(child);
        idsArr.push(model.id, ...ids);
        const tempData = {
          options: JSON.parse(stringifyDeep(model)),
          slotName: child.slot,
          children: combinationTree,
        };
        treeData.push(tempData);
      }
    });
  }
  return { ids: idsArr, combinationTree: treeData };
}

/**
 * 获取元件集合路由
 * @param ids
 * @returns
 */
const routerConfigSelector = "q-router-config.draggable2";
function getCombinationRouter(ids: string[]) {
  const routerConfig: IRouterConfig = {};
  const router = Array.from(document.querySelectorAll(routerConfigSelector)).map(
    (current: any) => current.value
  ) as IRouterConfig[];
  router.forEach((target: IRouterConfig) => {
    Object.keys(target).forEach((key: string) => {
      const route = target[key];
      if (!key || !ids.includes(key) || !route?.length) return;
      route.forEach((item: IRouterInfo) => {
        const tempReceive: IReceive[] = [];
        item.receive.forEach((item2) => {
          ids.includes(item2.target) ? tempReceive.push(item2) : void 0;
        });
        if (tempReceive.length) {
          item.receive = tempReceive;
          routerConfig[key] ? void 0 : (routerConfig[key] = []);
          routerConfig[key].push(item);
        }
      });
    });
  });
  return routerConfig;
}

/**
 * 获取元件集合属性绑定关系数据
 * @param ids
 * @returns
 */
const attrBindSelector = "q-attribute-bind.draggable2";
function getCombinationAttrBind(ids: string[]) {
  const bindConfig: IAttributeConfig = {};
  const bindList = Array.from(document.querySelectorAll(attrBindSelector)).map(
    (current: any) => current.value
  ) as IAttributeConfig[];
  bindList.forEach((target: IAttributeConfig) => {
    Object.keys(target).forEach((key: string) => {
      const attrBind = target[key];
      if (!key || !ids.includes(key) || !attrBind?.length) return;
      attrBind.forEach((bindInfo: IAttributeInfo) => {
        if (ids.includes(bindInfo.target) && ids.includes(bindInfo.bound.target)) {
          bindConfig[key] ? bindConfig[key].push(bindInfo) : (bindConfig[key] = [bindInfo]);
        }
      });
    });
  });
  return bindConfig;
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
        iovSchema: { group = [] },
      },
    } = info;
    const {
      options: {
        iovSchema: { componentName = "", text = "" },
      },
      children = [],
    } = info;
    if (!componentName) {
      notFind = true;
      return;
    }
    isString(group) && (group = JSON.parse(group));
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
      await DesignerPage.defineCustomWebcomponent(component);
    }
    for await (const item of children) {
      await checkComponent(item);
    }
  };
  await checkComponent(component);
  return notFind;
}

/**
 * 渲染元件集合
 * @param component
 */
export async function createCombinationComponent(
  component: ICombinationOptions,
  insetElement: HTMLElement,
  left: number,
  top: number
) {
  const mappingId = {};
  const createComponent = async (
    info: ICombinationOptions,
    parentElement: HTMLElement,
    left?: number,
    top?: number
  ) => {
    let { options, children = [] } = info;
    const { slotName } = info;
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
      element?.connectedCallback?.();
      element?.componentModel?.model?.lifeCycle?.updated?.(element, options, "initBaseModel");
      Reflect.deleteProperty(options, "iovSchema");
    }
    element?.componentModel?.updateModelEntity?.(JSON.stringify(options));
    if (slotName) element.slot = slotName;
    parentElement.appendChild(element);
    const componentModel = dragDrop.powerByComponent(element, left, top);
    if (componentModel?.model) {
      options.id ? (mappingId[options.id] = componentModel.model.id) : void 0;
      if (isNumber(left) && isNumber(top)) {
        useAppStore.pageModel.pageModel.setComponentsPageModel(componentModel.model);
        // 更新组件选中数据
        useAppStore.pageModel?.clearSelected();
        await useAppStore.pageModel?.addSelected([componentModel.model.id]);
        // 更新设置器和moveable实例
        changeSetter(componentModel.model, [ChangeSetterEnum.ALL]);
        // 更新图层面板选中
        useSettingStore.setSelectedKeys([componentModel.model.id]);
      } else {
        useAppStore.pageModel.pageModel.setComponentsPageModel(componentModel.model);
      }
    } else {
      message.destroy();
      message.error("组件model初始化失败!");
    }
    for await (const item of children) {
      await createComponent(item, element);
    }
  };
  await createComponent(component, insetElement, left, top);
  const router = component.router && isString(component.router) ? JSON.parse(component.router) : {};
  const attr_bind = component.attr_bind && isString(component.attr_bind) ? JSON.parse(component.attr_bind) : {};
  const { newRouterConfig, newAttrBind } = changeRouterAndAttrBind(router, attr_bind, mappingId);
  await recoverRouterAndAttrBind(newRouterConfig, newAttrBind);
  // 进行属性绑定，重写set操作
  newAttrBind.forEach((item: IAttributeInfo) => {
    handleAttributeBind(item);
  });
}

/**
 * 变更元件路由和属性绑定映射
 * @param router
 * @param mappingId
 */
function changeRouterAndAttrBind(
  router: IRouterConfig,
  attr_bind: IAttributeConfig,
  mappingId: { [key: string]: string }
) {
  const newRouterConfig: IRouterInfo[] = [];
  const newAttrBind: IAttributeInfo[] = [];
  Object.keys(router).forEach((key: string) => {
    const route: IRouterInfo[] = router[key];
    route.forEach((item: IRouterInfo) => {
      if (!mappingId[item.src]) return;
      item.src = mappingId[item.src];
      item.receive.forEach((item2: IReceive) => {
        if (!mappingId[item2.target]) return;
        item2.page = useAppStore.pageInstance?.id || "";
        item2.target = mappingId[item2.target];
      });
      newRouterConfig.push(item);
    });
  });
  Object.keys(attr_bind).forEach((key: string) => {
    const attrList: IAttributeInfo[] = attr_bind[key];
    attrList.forEach((attrInfo: IAttributeInfo) => {
      if (!mappingId[attrInfo.target] || !mappingId[attrInfo.bound.target]) return;
      attrInfo.target = mappingId[attrInfo.target];
      attrInfo.bound.target = mappingId[attrInfo.bound.target];
      newAttrBind.push(attrInfo);
    });
  });
  return { newRouterConfig, newAttrBind };
}

/**
 * 恢复元件路由和属性绑定
 * @param router
 * @param attr_bind
 */
async function recoverRouterAndAttrBind(router: IRouterInfo[], attr_bind: IAttributeInfo[]) {
  const bottomDropzone = document.querySelector(`#${CanvasIdEnum.BOTTOM}`);
  if (!bottomDropzone) {
    message.destroy();
    message.error(`未找到服务画布节点, 请检查页面节点!`);
    return;
  }
  // 路由配置
  if (router.length) {
    const { element: routerElement, isAppend: routerAppend } = await createRouterAndAttrBind(
      "q-router-config",
      routerConfigSelector,
      "路由配置"
    );
    await handleRouterAndAttrBind(bottomDropzone, routerElement, routerAppend, router, recoverTypesEnum.ROUTER);
  }
  // 属性绑定
  if (attr_bind.length) {
    const { element: attrBindElement, isAppend: attrBindAppend } = await createRouterAndAttrBind(
      "q-attribute-bind",
      attrBindSelector,
      "属性绑定"
    );
    await handleRouterAndAttrBind(
      bottomDropzone,
      attrBindElement,
      attrBindAppend,
      attr_bind,
      recoverTypesEnum.ATTR_BIND
    );
  }
}

/**
 * 创建路由配置元件|属性绑定元件
 * @param componentName
 * @param selector
 * @param log
 * @returns
 */
async function createRouterAndAttrBind(componentName: string, selector: string, log: string) {
  const componentsList = getComponents();
  let element: any = document.querySelector(selector);
  if (element?.value) {
    return { element, isAppend: false };
  }
  const componentDefined = await checkComponentDefined(componentName, componentsList);
  if (!componentDefined) {
    message.destroy();
    message.error(`未能成功加载${log}元件, 请检查元件仓库和浏览器控制台!`);
    return { element: null, isAppend: false };
  }
  element = document.createElement(componentName);
  if (!element?.value) {
    message.destroy();
    message.error(`未能成功加载${log}元件, 请检查元件仓库和浏览器控制台!`);
    return { element: null, isAppend: false };
  }
  return { element, isAppend: true };
}

/**
 * 处理路由配置元件|属性绑定元件数据
 * @param element
 * @param key
 */
async function handleRouterAndAttrBind(root: Element, element: any, isAppend: boolean, config: any[], type: string) {
  if (element?.value) {
    const tempValue = cloneDeep(element.value);
    config.forEach((item) => {
      switch (type) {
        case recoverTypesEnum.ROUTER:
          tempValue[item.src] ? tempValue[item.src].push(item) : (tempValue[item.src] = [item]);
          break;
        case recoverTypesEnum.ATTR_BIND:
          tempValue[item.bound.target]
            ? tempValue[item.bound.target].push(item)
            : (tempValue[item.bound.target] = [item]);
          break;
      }
    });
    element.value = tempValue;
    if (!isAppend) return;
    root.appendChild(element);
    const componentModel = dragDrop.powerByComponent(element, 0, 0);
    if (componentModel?.model) {
      const model = componentModel.model as ISchema;
      useAppStore.pageModel.add(model);
      // 更新图层面板
      useSettingStore.setTreeData(getTrees());
    }
  }
}
