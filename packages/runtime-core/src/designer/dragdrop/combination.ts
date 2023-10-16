import {
  ICombinationOptions,
  IComponent,
  IQDepotOptions,
  IReceive,
  IRouterConfig,
  IRouterInfo,
  ISchema
} from "@zzjz/v-uibuilder-types";
import { message } from "ant-design-vue";
import { cloneDeep, isEqual, isString } from "lodash-es";
import DesignerPage from "../../runtime/api/DesignerPage";
import { stringifyDeep } from "../../util";
import { isPlane } from "../aligntools";

/**
 * 组件组合
 */
export async function useCombination(selectedComponents: ISchema[]) {
  if (selectedComponents.length <= 1) return;
  if (!isPlane(selectedComponents)) {
    message.destroy();
    message.warning("只能组合同一平面内的组件!");
    return;
  }

  const { rect } = getCombinationRect();
  if (!rect) {
    message.destroy();
    message.error("集合矩阵信息获取失败!");
    return;
  }
}

/**
 * 获取集合的矩阵信息
 */
function getCombinationRect() {
  // let rect = null;
  // let slotName = "";
  // let parentElement = null;
  // let components = [];
  // if (useSettingStore.moveableExample.moveableTop.target) {
  //   components = useSettingStore.moveableExample.moveableTop.target;
  //   rect = useSettingStore.moveableExample.moveableTop.getRect();
  //   slotName = components[0].slot;
  //   parentElement = components[0].parentElement;
  // } else if (useSettingStore.moveableExample.moveableBottom.target) {
  //   // components = useSettingStore.moveableExample.moveableBottom.target;
  //   // rect = useSettingStore.moveableExample.moveableBottom.getRect();
  //   // slotName = components[0].slot;
  //   // parentElement = components[0].parentElement;
  // }
  // const minLeft = Math.min(...components.map((element: HTMLElement) => formatStyleUnit(element, "left")));
  // const minTop = Math.min(...components.map((element: HTMLElement) => formatStyleUnit(element, "top")));
  // rect?.left && (rect.left = minLeft);
  // rect?.top && (rect.top = minTop);
  return { rect: "", slotName: "", parentElement: null };
}



/**
 * 拆分组合
 */
export function useCombinationSplit(id: string) {
  const element = document.querySelector(`#${id}`) as HTMLElement;
  if (!element) {
    message.destroy();
    message.error("元件集合实例获取失败!");
    return;
  }
  // const focusElement = setSplitChildren(element);
}


/**
 * 保存元件集合
 */
export async function useSaveCombination(
  componentID: string,
  info: { [key: string]: string },
  combinationType: string
) {
  const { type = "", text = "" } = info;
  const id = componentID;
  const element = document.querySelector(`#${id}`) as unknown as IComponent;
  if (!element) {
    message.destroy();
    message.error("元件集合实例获取失败!");
    return;
  }
  const tempModel = cloneDeep(element?.componentModel?.model ?? {});
  const { ids, combinationTree } = getCombinationTree(element);
  const routerConfig = getCombinationRouter(ids);
  const data = [
    {
      componentName: "my-component",
      text,
      type,
      group: combinationType === "user" ? ["我的元件"] : ["公共元件"],
      options: JSON.parse(stringifyDeep(tempModel)),
      router: routerConfig,
      children: combinationTree,
    },
  ];
  return data;
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
 */
function getCombinationRouter(ids: string[]) {
  const routerConfig: IRouterConfig = {};
  const router = Array.from(document.querySelectorAll("q-router-config")).map(
    (current: any) => current.value
  ) as IRouterConfig[];
  router.forEach((target: { [key: string]: any } = {}) => {
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
 * 检查元件集合子组件是否存在
 * @param component
 */
export async function checkCombinationComponent(component: ICombinationOptions, componentsList: IQDepotOptions[]) {
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
      const componentIndex = componentsList.findIndex(
        (item: IQDepotOptions) =>
          item.componentName === componentName && isEqual(item.group, group) && item.text === text
      );
      if (componentIndex === -1) {
        notFind = true;
        return;
      }
      const component = cloneDeep(componentsList[componentIndex]);
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
export function createCombinationComponent(
  component: ICombinationOptions,
  insetElement: HTMLElement,
  left: number,
  top: number
) {
  const mappingId = {};
  const createComponent = (info: ICombinationOptions, parentElement: HTMLElement) => {
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
    children.forEach((item: ICombinationOptions) => {
      createComponent(item, element);
    });
  };
  createComponent(component, insetElement);
  const router = component.router && isString(component.router) ? JSON.parse(component.router) : {};
  changeCombinationRouter(router, mappingId);
}

/**
 * 变更元件集合路由映射
 * @param router
 * @param mappingId
 */
function changeCombinationRouter(router: IRouterConfig, mappingId: { [key: string]: string }) {
  const newRouter: IRouterConfig = {};
  Object.keys(router).forEach((key: string) => {
    const route: IRouterInfo[] = router[key];
    route.forEach((item: IRouterInfo) => {
      if (!mappingId[item.src]) return;
      item.src = mappingId[item.src];
      item.receive.forEach((item2: IReceive) => {
        if (!mappingId[item2.target]) return;
        item2.target = mappingId[item2.target];
      });
      newRouter[item.src] ? void 0 : (newRouter[item.src] = []);
      newRouter[item.src].push(item);
    });
  });
}
