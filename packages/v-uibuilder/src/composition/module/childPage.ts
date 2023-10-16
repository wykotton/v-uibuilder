import { CanvasIdEnum, EditTypeEnum } from "@/enums/appEnum";
import { ICombinationOptions } from "@/types/ICombination";
import { IComponent } from "@/types/IComponent";
import { stringifyDeep } from "@/utils";
import { cloneDeep, isString, omit } from "lodash-es";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { usePluginStoreWithOut } from "@/store/modules/plugin";
import { findChildPageApi, saveChildPageApi } from "@/api/uibuilder/edit";
import { message } from "ant-design-vue";
import { checkExceptionComponents, getDesignerPage, noticeWarehouses, retryException } from "./page";
import { silentClearCanvas } from "./setting";
import { addComponentMask } from "@/utils/moveable/mask";
import { initUndoRedo } from "./header";
import { useResetTree } from "./tree";
import { dragDrop } from "@/utils/dragdrop/index";
import { IQDepotOptions } from "@/types/IQDepot";
import { ISchema } from "@/types/IModelSchema";
import DesignerPage from "@/utils/designer/DesignerPage";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();
const usePluginStore = usePluginStoreWithOut();

/**
 * 保存子页面
 * @param ignore
 * @returns
 */
export function useSaveChildPage(ignore = false) {
  checkExceptionComponents();
  return new Promise<void>(async (resolve) => {
    if (useAppStore?.freezeSave) {
      resolve();
      return;
    }
    const projectId = useAppStore?.pageInstance?.project_id;
    const id = useAppStore?.childPageId;
    if (!id || !projectId) {
      resolve();
      return;
    }
    const innerDropzone = document.querySelector(`#${CanvasIdEnum.INNER}`) as unknown as IComponent;
    const bottomDropzone = document.querySelector(`#${CanvasIdEnum.BOTTOM}`) as unknown as IComponent;
    const params = {
      projectId,
      id,
      innerDropzone: innerDropzone ? getChildPageTree(innerDropzone) : [],
      bottomDropzone: bottomDropzone ? getChildPageTree(bottomDropzone) : [],
    };
    const request = await saveChildPageApi(params);
    const {
      code,
      info: { msg = "" },
    } = request.data;
    if (code !== 200) {
      if (!ignore) {
        message.destroy();
        message.error(msg || "子页面保存失败");
      }
      resolve();
      return;
    }
    if (!ignore) {
      message.destroy();
      message.success("子页面保存成功");
    }
    resolve();
  });
}

/**
 * 获取子页面treeData
 */
function getChildPageTree(element: IComponent) {
  const treeData: any = [];
  const children = Array.from(element.children);
  if (children.length) {
    children.forEach((child: any) => {
      if (child.id && child.classList.contains("draggable2") && child.componentModel) {
        const model = cloneDeep(child.componentModel.model);
        const tempData = {
          options: JSON.parse(stringifyDeep(model)),
          slotName: child.slot,
          children: getChildPageTree(child),
        };
        treeData.push(tempData);
      }
    });
  }
  return treeData;
}

/**
 * 编辑子页面，进行初始化
 * @param id
 * @returns
 */
export async function editChildPage(id: string) {
  if (id === useAppStore.childPageId) {
    message.destroy();
    message.warning("已在编辑当前子页面");
    return;
  }
  const projectId = useAppStore?.pageInstance?.project_id;
  if (!id || !projectId) return;
  useAppStore.setHomeLoading(true);
  const request = await findChildPageApi({ projectId, id });
  const {
    code,
    results,
    info: { msg = "" },
  } = request.data;
  if (code !== 200) {
    message.destroy();
    message.error(msg);
    useAppStore.setHomeLoading(false);
    return;
  }
  useAppStore.setFreezeSave(true);
  useAppStore.setEditType(EditTypeEnum.CHILD_PAGE);
  useAppStore.setChildPageId(id);
  // 清空所有画布
  silentClearCanvas();
  // 清空pageModel
  useAppStore.pageModel?.clear();
  useAppStore.pageModel?.clearSelected();
  // 创建子页面
  createChildPage(results.innerDropzone, results.bottomDropzone).then(() => {
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
    useAppStore.setHomeLoading(false);
    usePluginStore.closeFixedMenu();
    setTimeout(() => {
      useAppStore.setFreezeSave(false);
    }, 2000);
  });
}

/**
 * 检查子页面元件
 * @param component
 */
interface IChildPageOptions {
  options: ISchema;
  slotName: string;
  children: IChildPageOptions[];
}
export async function checkPageComponent(component: IChildPageOptions, componentsList: IQDepotOptions[]) {
  const checkComponent = async (info: IChildPageOptions) => {
    if (isString(info.options)) info.options = JSON.parse(info.options);
    if (isString(info.children)) info.children = JSON.parse(info.children);
    let {
      options: {
        iovSchema: { group = [] },
      },
    } = info;
    const {
      options: {
        iovSchema: { componentName = "" },
      },
      children = [],
    } = info;
    if (componentName) {
      isString(group) && (group = JSON.parse(group));
      if (!customElements.get(componentName)) {
        const componentIndex = componentsList.findIndex((item: IQDepotOptions) => item.componentName === componentName);
        if (componentIndex !== -1) {
          const component = cloneDeep(componentsList[componentIndex]);
          await DesignerPage.defineCustomWebcomponent(component);
        }
      }
    }
    for await (const item of children) {
      await checkComponent(item);
    }
  };
  await checkComponent(component);
}

/**
 * 创建子页面
 */
function createChildPage(inner: any[], bottom: any[]) {
  const componentsList: IQDepotOptions[] = cloneDeep(usePluginStore.componentsList);
  return new Promise<void>(async (resolve) => {
    const innerDropzone = document.querySelector(`#${CanvasIdEnum.INNER}`) as HTMLElement;
    const bottomDropzone = document.querySelector(`#${CanvasIdEnum.BOTTOM}`) as HTMLElement;
    if (innerDropzone) {
      for await (const item of inner) {
        await checkPageComponent(item, componentsList);
        childPageRender(item, innerDropzone);
      }
    }
    if (bottomDropzone) {
      for await (const item of bottom) {
        await checkPageComponent(item, componentsList);
        childPageRender(item, bottomDropzone);
      }
    }
    resolve();
  });
}

/**
 * 子页面渲染
 * @param component
 */
async function childPageRender(component: ICombinationOptions, insetElement: HTMLElement) {
  const createComponent = (info: ICombinationOptions, parentElement: HTMLElement) => {
    let { options, children = [] } = info;
    const { slotName } = info;
    if (isString(options)) options = JSON.parse(options);
    if (isString(children)) children = JSON.parse(children);
    const {
      iovSchema: { componentName = "" },
    } = options;
    const element = document.createElement(componentName) as any;
    if (!element) return;
    // 兼容DI Angular组件创建后不初始化的问题
    if (element && !element.componentModel && element.connectedCallback) {
      element?.connectedCallback?.();
      element?.componentModel?.model?.lifeCycle?.updated?.(element, options, "initBaseModel");
      Reflect.deleteProperty(options, "iovSchema");
    }
    element.classList.add("draggable2");
    element.setAttribute("data-element-type", element.tagName);
    element?.componentModel?.updateModelEntity?.(JSON.stringify(options));
    if (slotName) element.slot = slotName;
    parentElement.appendChild(element);
    if (element?.componentModel?.model) {
      useAppStore.pageModel.pageModel.setComponentsPageModel(element.componentModel.model);
    }
    children.forEach((item: ICombinationOptions) => {
      createComponent(item, element);
    });
  };
  await createComponent(component, insetElement);
}

/**
 * 退出子页面编辑
 */
export async function closeChildPage() {
  const pageId = useAppStore?.pageInstance?.id;
  if (!pageId) {
    message.destroy();
    message.error("未找到页面id, 请刷新页面重试");
    return;
  }
  useAppStore.setHomeLoading(true);
  const pageInfo = await getDesignerPage(String(pageId));
  if (!pageInfo) {
    message.destroy();
    message.error("未获取到当前页面数据");
    useAppStore.setHomeLoading(false);
    return;
  }
  await useSaveChildPage(true);
  pageInfo?.page_name ? useAppStore.setPageName(pageInfo.page_name) : useAppStore.setPageName("未命名");
  useAppStore.setPageInstance(omit(pageInfo, "custom_model"));
  let tempDesignerPage = pageInfo?.custom_model;
  if (tempDesignerPage) {
    tempDesignerPage = JSON.parse(tempDesignerPage);
    useAppStore.setFreezeSave(true);
    useAppStore.setEditType(EditTypeEnum.PAGE);
    useAppStore.setChildPageId("");
    // 清空所有画布
    silentClearCanvas();
    // 清空pageModel
    useAppStore.pageModel?.clear();
    useAppStore.pageModel?.clearSelected();
    useAppStore.pageModel?.clearExceptionComponents();
    createCurrentPage(tempDesignerPage).then(() => {
      // 初始化撤销重做
      initUndoRedo();
      // 重置图层面板
      useResetTree();
      // 更新moveable实例
      useSettingStore.moveableExample.setElementGuidelines();
      // 元件初始化异常重试
      retryException();
      useAppStore.setHomeLoading(false);
      usePluginStore.closeFixedMenu();
      setTimeout(() => {
        useAppStore.setFreezeSave(false);
      }, 2000);
    });
  } else {
    useAppStore.setHomeLoading(false);
  }
}

/**
 * 回显当前页面数据
 * @param config
 */
function createCurrentPage(config: any) {
  return new Promise<void>(async (resolve) => {
    const innerDropzone = document.querySelector(`#${CanvasIdEnum.INNER}`) as HTMLElement;
    const bottomDropzone = document.querySelector(`#${CanvasIdEnum.BOTTOM}`) as HTMLElement;
    const tempInner = document.createElement("div");
    const tempBottom = document.createElement("div");
    tempInner.innerHTML = config?.dynamicHTML || "";
    tempBottom.innerHTML = config?.pluginHTML || "";
    if (innerDropzone) {
      for await (const element of Array.from(tempInner.children)) {
        innerDropzone.append(element);
      }
    }
    if (bottomDropzone) {
      for await (const element of Array.from(tempBottom.children)) {
        bottomDropzone.append(element);
      }
    }
    for await (const component of config.componentsArray) {
      if (!component) continue;
      const {
        id,
        iovSchema: { componentName },
      } = component;
      const componentElement = document.getElementById(id) as any;
      if (componentElement["DragDrop"] !== undefined) componentElement.componentModel.model.DragDrop = dragDrop; // 元件在画布中初始化需要用到
      try {
        await useAppStore.pageModel.pageModel.whenDefinedComponent(componentName);
      } catch (error) {
        console.error(`${componentName}元件未找到或元件未定义!:`, error);
        continue;
      }
      try {
        componentElement?.componentModel?.updateModelEntity?.(JSON.stringify(component));
        useAppStore.pageModel.pageModel.setComponentsPageModel(componentElement.componentModel.model);
        componentElement?.componentModel?.model?.lifeCycle?.created?.();
        continue;
      } catch (error) {
        console.error(`元件初始化失败:`, error);
      }
      if (componentElement) {
        addComponentMask(componentElement);
      }
      useAppStore.pageModel.pageModel.setExceptionComponents(component);
    }
    for await (const component of config?.exceptionComponents ?? []) {
      try {
        const componentElement = document.querySelector(`#${component.id}`);
        if (componentElement) {
          addComponentMask(componentElement as HTMLElement);
        }
        useAppStore.pageModel.pageModel.setExceptionComponents(component);
      } catch (error) {
        console.log(error);
      }
    }
    resolve();
  });
}

/**
 * 保存子页面并重置子页面状态
 */
export async function resetChildPage() {
  if (useAppStore.editType === EditTypeEnum.CHILD_PAGE) {
    await useSaveChildPage(true);
    useAppStore.setEditType(EditTypeEnum.PAGE);
    useAppStore.setChildPageId("");
  }
}
