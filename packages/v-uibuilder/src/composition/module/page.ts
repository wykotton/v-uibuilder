import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { saveInfo, systemFind, updateInfo } from "@/api/uibuilder/edit";
import { isEqual, debounce, throttle, isElement } from "lodash-es";
import { ISchema } from "@/types/IModelSchema";
import { message } from "ant-design-vue";
import { changeSetter } from "./setting";
import { usePluginStoreWithOut } from "@/store/modules/plugin";
import { createHashId } from "@/utils/uuid";
import { getTrees, setNeedToExpandKeys, useResetTree } from "./tree";
import { useMutationObserver } from "@vueuse/core";
import { changeMoveableAndGuides, recordSnapshot } from "./header";
import { getNotSVGElement, isSVGElement } from "@/utils/utils";
import { CanvasIdEnum, ComponentProtocolEnum, EditTypeEnum } from "@/enums/appEnum";
import { stringifyDeep } from "@/utils";
import $ from "jquery";
import { ChangeSetterEnum } from "@/enums/settingEnum";
import { removeComponentMask } from "@/utils/moveable/mask";
import { IComponent } from "@/types/IComponent";
import { useSaveChildPage } from "./childPage";
import { PageEnum } from "@/enums/pageEnum";
import { router } from "@/router";
import { componentsAction } from "./plugin";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();
const usePluginStore = usePluginStoreWithOut();

/**
 * 页面焦点状态
 */
export function pageFocusEvent() {
  const tagName = document.activeElement?.tagName;
  const focusArr = ["INPUT", "TEXTAREA", "Q-CODE-EDITOR", "Q-ATTRIBUTE-SETTING", "Q-STYLE-SETTING", "Q-EVENT-SETTING"];
  if (tagName && focusArr.includes(tagName)) {
    useAppStore.setIsFocus(true);
  } else {
    useAppStore.setIsFocus(false);
  }
}
export function addFocusEvents() {
  document.addEventListener("click", pageFocusEvent);
}
export function removeFocusEvents() {
  document.removeEventListener("click", pageFocusEvent);
}

/**
 * window窗口失焦监听
 */
export function addWindowEvents() {
  window.onblur = () => {
    useAppStore.setIsCtrlKey(false);
    useAppStore.setIsShiftKey(false);
    useAppStore.setIsSpaceKey(false);
    useAppStore.setIsZeroKey(false);
  };
}

/**
 * 添加canvas观察器
 * @param innerDropzone
 * @param bottomDropzone
 */
export function addCanvasObserver(innerDropzone: HTMLElement, bottomDropzone: HTMLElement) {
  // 观察器的配置（需要观察什么变动）
  const config = {
    // attributes: true,
    childList: true,
    subtree: true,
  };
  const observer = (el: HTMLElement) => {
    return useMutationObserver(el, callBackDebounce, config);
  };
  const callBackDebounce = debounce(() => {
    console.log("canvas变更");
    if (useAppStore?.freezeSave) return;
    autoSavePage(true);
  }, 1000);
  if (innerDropzone) {
    const innerObserver = observer(innerDropzone);
    useAppStore.setInnerObserver(innerObserver);
  }
  if (bottomDropzone) {
    const bottomObserver = observer(bottomDropzone);
    useAppStore.setBottomObserver(bottomObserver);
  }
  useAppStore.setEditStatus(true);
}

/**
 * 获取元素html字符串
 * @param id 节点id
 * @returns
 */
export function getCanvasHtml(id: string) {
  const element = document.querySelector(`#${id}`);
  if (element) {
    // 移除无效的html
    const selector = [".moveable-control-box", ".selecto-selection", "q-child-page[dynamic=true]"];
    const innerHTML = removeInvalidHtml(element, selector);
    return innerHTML;
  } else {
    return "not found";
  }
}

/**
 * 移除无效的html
 * @param root
 * @param selector
 * @returns
 */
export function removeInvalidHtml(root: Element, selector: string[]) {
  let innerHTML = root.innerHTML;
  try {
    selector.forEach((item: string) => {
      Array.from(root.querySelectorAll(item)).forEach((element: Element) => {
        if (element) {
          innerHTML = innerHTML.replace(element.outerHTML, "");
        }
      });
    });
    return innerHTML;
  } catch (error) {
    return innerHTML;
  }
}

/**
 * 新建页面
 * @param {number} projectId 项目id
 * @param {boolean} ignore 忽略更新提示
 */
export function createPage(projectId: number, pageName = "", ignore = false) {
  return new Promise<void>(async (resolve, reject) => {
    const DesignerPage = {
      componentsArray: [],
      dynamicHTML: "",
      pluginHTML: "",
    };
    const tempObj = { DesignerPage, projectId, pageName };
    const ajax = saveInfo(tempObj);
    ajax
      .then((data) => {
        const {
          data: {
            info: { msg = `fail` },
            results,
          },
        } = data;
        if (msg === `fail`) {
          message.error("新增页面失败!");
          reject();
        }
        if (ignore) {
          resolve(results);
          return;
        }
        resolve(results);
        message.success("新增页面成功");
      })
      .catch(() => {
        reject();
      });
  });
}

/**
 * 保存页面
 * @param {string} id 页面id
 * @param {boolean} ignore 忽略更新提示
 */
export function savePage(id: number, ignore = false) {
  checkExceptionComponents();
  return new Promise<void>(async (resolve, reject) => {
    if (useAppStore?.freezeSave) reject();
    const tempObj = {
      DesignerPage: getPageInfo(),
      theme: {
        disableWarehouse: useAppStore.disableWarehouse,
        canvasStyleData: useAppStore.canvasStyleData,
        layoutData: useAppStore.layoutData,
      },
      id,
      pageName: useAppStore.pageName,
    };
    if (!tempObj.DesignerPage) {
      if (!ignore) {
        message.error("页面信息获取失败, 无法保存!");
      }
      reject();
      return;
    }
    const ajax = updateInfo(tempObj);
    ajax
      .then((data) => {
        const {
          data: {
            info: { msg = `fail` },
            results,
          },
        } = data;
        if (msg === `fail`) {
          message.error("保存页面失败!");
          reject();
          return;
        }
        if (ignore) {
          resolve(results);
          return;
        }
        resolve(results);
        message.success("保存页面成功");
      })
      .catch(() => {
        reject();
      });
  });
}

/**
 * 自动保存页面
 */
export const autoSavePage = throttle(
  (ignore = false) => {
    switch (useAppStore.editType) {
      case EditTypeEnum.PAGE:
        const pageId = useAppStore?.pageInstance?.id;
        if (!pageId || !useAppStore?.editStatus) return;
        savePage(Number(pageId), ignore);
        break;
      case EditTypeEnum.CHILD_PAGE:
        useSaveChildPage(ignore);
        break;
    }
  },
  3000,
  { trailing: false }
);

/**
 * 清除画布异常元件
 */
export function checkExceptionComponents() {
  const innerDropzone = document.querySelector(`#${CanvasIdEnum.INNER}`);
  const bottomDropzone = document.querySelector(`#${CanvasIdEnum.BOTTOM}`);
  useAppStore.setFreezeSave(true);
  if (cleanExceptionComponents(innerDropzone) || cleanExceptionComponents(bottomDropzone)) {
    // 更新图层面板
    useSettingStore.setTreeData(getTrees());
  }
  useAppStore.setFreezeSave(false);
}
function cleanExceptionComponents(canvas: HTMLElement | Element | null) {
  const whiteList = ["draggable2", "moveable-control-box", "selecto-selection"];
  let isException = false;
  if (canvas?.children.length) {
    Array.from(canvas.children).forEach((component) => {
      // 排除插件DOM
      if (component.classList.contains(whiteList[1]) || component.classList.contains(whiteList[2])) return;
      // 异常DOM
      if (!component.id || !component.classList.contains(whiteList[0])) {
        component.remove();
        isException = true;
      }
    });
  }
  return isException;
}

/**
 * 获取页面数据
 * @returns
 */
export function getPageInfo() {
  const innerDropzoneHtml = getCanvasHtml(CanvasIdEnum.INNER);
  const bottomDropzoneHtml = getCanvasHtml(CanvasIdEnum.BOTTOM);
  if (innerDropzoneHtml === "not found" || bottomDropzoneHtml === "not found") {
    return null;
  }
  const tempData = {
    componentsArray: useAppStore?.pageModel?.pageModel?.componentsArray
      ? useAppStore.pageModel.pageModel.componentsArray
      : [],
    exceptionComponents: useAppStore?.pageModel?.pageModel?.exceptionComponents
      ? useAppStore.pageModel.pageModel.exceptionComponents
      : [],
    dynamicHTML: innerDropzoneHtml,
    pluginHTML: bottomDropzoneHtml,
  };
  const pageInfo = JSON.parse(stringifyDeep(tempData));
  pageInfo.componentsArray.forEach((item: ISchema) => {
    checkComponentModel(item);
  });
  return pageInfo;
}

/**
 * 获取页面实例数据
 * @param id
 * @returns
 */
export async function getDesignerPage(id: string) {
  const request = await systemFind({ id });
  const { code, results } = request.data;
  const pageInfo = results?.[0] || {};
  switch (code) {
    case 200:
      return pageInfo;
    case 403:
      message.error("无权限编辑此ui-builder实例!");
      setTimeout(() => {
        router.replace(PageEnum.WORKSPACE);
      }, 3000);
      return null;
    case 404:
      message.error("ui-builder实例不存在!");
      setTimeout(() => {
        router.replace(PageEnum.WORKSPACE);
      }, 3000);
      return null;
    case 500:
      message.error("获取ui-builder实例失败!");
      setTimeout(() => {
        router.replace(PageEnum.WORKSPACE);
      }, 3000);
      return null;
  }
}

/**
 * 处理页面主题数据
 */
export function handleTheme(pageInfo: any, emit: string) {
  let theme = pageInfo?.theme;
  if (theme) {
    theme = JSON.parse(theme);
    // 处理禁用的仓库
    let disableWarehouse = theme.disableWarehouse || [];
    try {
      if (emit) {
        const emits = String(emit).split(",");
        disableWarehouse = emits;
      }
    } catch (error) {}
    disableWarehouse ? useAppStore.setDisableWarehouse(disableWarehouse) : void 0;
    // 设置页面layout布局
    if (theme.layoutData && Object.keys(theme.layoutData.length > 0)) {
      useAppStore.setLayout(theme.layoutData);
    }
    // 设置画布大小
    if (theme.canvasStyleData && Object.keys(theme.canvasStyleData.length > 0)) {
      useAppStore.setCanvasStyle(theme.canvasStyleData);
      changeMoveableAndGuides();
    }
  }
}

/**
 * 通知各个子仓库页面已经加载完成
 */
export function noticeWarehouses() {
  useAppStore.warehouses.forEach(async (item: { name: string }) => {
    const result = await componentsAction(item.name, { type: ComponentProtocolEnum.LOAD, body: useAppStore.pageModel });
    if (!result) {
    }
  });
}

/**
 * 设置组件选中数据
 * @param {*} element
 */
export async function setFocus(e: any) {
  const element = e.currentTarget;
  if (!element) return;
  if (useAppStore.isCtrlKey) {
    const focusId = useAppStore.pageModel?.checkFocus(element.id);
    if (!focusId) {
      // 更新图层面板选中项
      await useAppStore.pageModel?.addSelected([element.id]);
      const focusElement = useAppStore.pageModel?.selectedComponents.map((component: ISchema) => component.id);
      if (!isEqual(useSettingStore.selectedKeys, focusElement)) {
        useSettingStore.setSelectedKeys(focusElement);
        if (focusElement.length === 1) {
          // 更新设置器
          changeSetter(useAppStore.pageModel?.currentComponent, [ChangeSetterEnum.ALL]);
        } else {
          // 多选时，不更新设置器，只更新moveable实例
          changeSetter(useAppStore.pageModel?.currentComponent, [ChangeSetterEnum.MOVEABLE]);
        }
      }
    }
    return;
  }
  const focusElement = [element.id];
  useAppStore?.pageModel.clearSelected();
  await useAppStore?.pageModel.addSelected(focusElement);
  if (!isEqual(useSettingStore.selectedKeys, focusElement)) {
    // 更新图层面板选中项
    useSettingStore.setSelectedKeys(focusElement);
    // 更新设置器
    changeSetter(useAppStore.pageModel?.currentComponent, [
      ChangeSetterEnum.ATTRIBUTE,
      ChangeSetterEnum.STYLE,
      ChangeSetterEnum.EVENT,
    ]);
  }
}

/**
 * 保存时检查组件model，去除不需要的属性
 * @param model
 */
export function checkComponentModel(model: ISchema) {
  const componentName = model?.iovSchema?.componentName;
  if (!componentName) return;
  switch (componentName) {
    case "q-config-center":
      Reflect.deleteProperty(model, "attribute");
      break;
    case "custom":
      break;
    default:
      break;
  }
}

/**
 * 检查组件属于哪个画布
 * @param id
 * @returns
 */
export function checkComponentRoot(id: string) {
  if ($(`#${id}`).parents(`#${CanvasIdEnum.INNER}`).length) {
    return CanvasIdEnum.INNER;
  }
  if ($(`#${id}`).parents(`#${CanvasIdEnum.BOTTOM}`).length) {
    return CanvasIdEnum.BOTTOM;
  }
  return null;
}

/**
 * 设置moveable拖拽实例
 * @param e
 * @param clickElement
 * @param dragStart
 */
function draggingIsEnabledOnlyWhenTheComponentIsDesigned(e: any, clickElement: any, dragStart: boolean) {
  e.stopPropagation();
  e.preventDefault();
  // 元件设计时状态才开启拖拽
  if (!e.currentTarget?.componentModel?.model?.contextType) {
    if (isElement(clickElement)) {
      clickElement?.click && clickElement.click();
    }
    if (!useAppStore.isCtrlKey) {
      // 设置moveable实例
      useSettingStore.moveableExample.setMoveableTarget(e, dragStart);
    }
  } else {
    if (!useAppStore.isCtrlKey) {
      // 清除所有moveable实例
      useSettingStore.moveableExample.clearAllTarget();
    }
  }
}

/**
 * 组件mousedown(鼠标左键)
 * 只能选中非容器子组件
 * @param e
 * @returns
 */
export function onClickComponent(e: any) {
  let clickElement = e.currentTarget?.shadowRoot?.activeElement ?? e.originalEvent?.composedPath?.()[0];

  if (isSVGElement(clickElement)) {
    clickElement = getNotSVGElement(e.originalEvent?.composedPath?.());
    if (!clickElement) {
      console.error(`未找到绑定事件节点!`);
      return;
    }
  }

  // 容器子组件禁止单击选中
  const targetId = e.currentTarget?.parentElement?.id;
  if (targetId && targetId !== CanvasIdEnum.INNER && targetId !== CanvasIdEnum.BOTTOM) {
    if (useAppStore.isCtrlKey) {
      // ctrl多选时，阻止冒泡，防止dblclick无法多选
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    return;
  }
  draggingIsEnabledOnlyWhenTheComponentIsDesigned(e, clickElement, true);
  // 设置组件选中
  setFocus(e);
}

/**
 * 双击选中组件
 * 只能选中容器子组件
 * @param e
 * @returns
 */
export function ondblclickComponent(e: any) {
  // 画布子组件禁止双击选中，会和mousedown造成重复操作
  const targetId = e.currentTarget?.parentElement?.id;
  if (targetId && (targetId === CanvasIdEnum.INNER || targetId === CanvasIdEnum.BOTTOM)) return;

  draggingIsEnabledOnlyWhenTheComponentIsDesigned(e, null, false);
  // 设置组件选中
  setFocus(e);
}

/**
 * 画布点击
 * @param e
 * @returns
 */
export function onClickNode(e: any) {
  // 关闭左侧功能区的drawer
  usePluginStore.closeFixedMenu();
  // moveable阻止冒泡状态
  if (useSettingStore.moveableExample.toolsState.stopPropagation) {
    useSettingStore.moveableExample.toolsState.stopPropagation = false;
    return;
  }
  // 点击组件时防止冒泡触发此方法
  if (
    e &&
    ((e.target.classList.contains("draggable2") && !e.target.classList.contains("nodraggable")) ||
      $(e.target).parents(".draggable2").length)
  )
    return;
  // 在未选择组件的情况下，点击画布可取消所有组件focus
  if (e && !useAppStore.isShiftKey && !useAppStore.isCtrlKey) {
    const { target } = e;
    if (target.id === CanvasIdEnum.INNER || target.id === CanvasIdEnum.BOTTOM) {
      useAppStore.pageModel?.clearSelected();
      useSettingStore.setSelectedKeys([]);
      useSettingStore.moveableExample.clearAllTarget();
    }
  }
}

/**
 * 复制组件
 * @returns
 */
export async function useCloneComponent() {
  if (useAppStore?.pageModel?.selectedComponents.length === 1) {
    const currentModel = useAppStore.pageModel.currentComponent;
    const component = document.querySelector(`#${currentModel.id}`) as unknown as IComponent;
    if (!component || !component.componentModel) {
      message.destroy();
      message.error("未找到元件实例!");
      return;
    }
    const { element, componentsArray } = cloneComponent(component);
    if (!element || !componentsArray || !componentsArray.length) {
      message.destroy();
      message.error("复制失败!");
      return;
    }
    component?.parentElement?.appendChild?.(element);
    componentsArray.forEach((item: ISchema) => {
      useAppStore.pageModel.add(item);
    });
    // 更新组件选中数据
    useAppStore.pageModel?.clearSelected();
    await useAppStore.pageModel?.addSelected([element.id]);
    // 更新设置器和moveable实例
    changeSetter(element.componentModel.model, [ChangeSetterEnum.ALL]);
    // 更新图层面板
    useSettingStore.setTreeData(getTrees());
    setNeedToExpandKeys();
    useSettingStore.setSelectedKeys([element.id]);
    // 添加快照
    recordSnapshot();
  }
}

/**
 * 深度复制组件
 */
function cloneComponent(component: any) {
  if (!component) return { element: null, componentsArray: [] };
  const componentsArray: ISchema[] = [];
  const element = component.cloneNode(true);
  const clone = (element: any) => {
    const tempComponent = document.querySelector(`#${element.id}`) as unknown as IComponent;
    if (!tempComponent || !tempComponent.componentModel) return;
    const elementModel = JSON.parse(stringifyDeep(tempComponent.componentModel.model));
    const id = (element.id = createHashId(12, element.tagName));
    element.id = id;
    elementModel.id = id;
    // 兼容DI Angular组件创建后不初始化的问题
    element?.connectedCallback?.();
    element?.componentModel?.updateModelEntity?.(JSON.stringify(elementModel));
    componentsArray.push(element.componentModel.model);
    const children = Array.from(element.children);
    if (children.length) {
      children.forEach((child: any) => {
        if (child.classList.contains("draggable2") && child.componentModel) {
          clone(child);
        }
      });
    }
  };
  clone(element);
  return { element, componentsArray };
}

/**
 * 元件初始化异常重试
 */
let retryTimer: any = undefined;
export function retryException() {
  let retryCount = 0;
  clearTimeout(retryTimer);
  const retry = () => {
    if (retryCount >= 5 || !useAppStore.pageModel?.pageModel.exceptionComponents.length) return;
    const oldIndex = useAppStore.pageModel.pageModel.exceptionComponents.length;
    useAppStore.pageModel.pageModel.exceptionComponents.forEach((component: ISchema) => {
      const componentModel = useAppStore.pageModel.get(component.id);
      const element: any = document.querySelector(`#${component.id}`);
      if (!element || componentModel) {
        useAppStore.pageModel.pageModel.deleteExceptionComponents(component.id);
        removeComponentMask(element);
        return;
      }
      if (element?.componentModel) {
        // 元件已被正常渲染，进行数据恢复
        try {
          element.componentModel.updateModelEntity(JSON.stringify(component));
          useAppStore.pageModel.add(element.componentModel.model);
          useAppStore.pageModel.pageModel.deleteExceptionComponents(element.id);
          removeComponentMask(element);
        } catch (error) {}
      }
    });
    if (oldIndex > useAppStore.pageModel.pageModel.exceptionComponents.length) {
      useResetTree(true, false, false, true);
    }
    retryTimer = setTimeout(() => {
      retryCount++;
      retry();
    }, 1000);
  };
  retry();
}

/**
 * 检测模型内|部是否包含自定义movealbe方法
 * 组件内|部方法返回false或者无返回的时候不会影响原有方法执行
 * @param methodName 方法名
 * @param dom 当前节点
 * @param argum 给调用方法传递的参数
 * @param option 配置{ returnObj: 是否返回对象, isp: 是否检测父级, property: 属性 }
 * @returns true: 则阻断原有方法执行，慎用，通常用于需要自定义该方法的时候使用
 */
export function detectionModalLoad(
  methodName: string,
  dom: any,
  argum: any,
  option: { returnObj?: boolean; isp?: boolean; property: string } = {
    returnObj: false,
    isp: false,
    property: "moveable",
  }
) {
  const moveableObj = dom?.componentModel?.model?.publicAPI?.[option.property];
  if (option.returnObj) {
    // let resutl:{ self?: {}, parent?: {} } = {}
    if (option.isp) {
      const moveableParentObj = dom.parentElement?.componentModel?.model?.publicAPI?.[option.property];
      if (moveableParentObj?.hasOwnProperty(methodName)) return moveableParentObj[methodName](argum);
    }
    if (moveableObj?.hasOwnProperty(methodName)) return moveableObj[methodName](argum);
    return {};
  } else {
    if (option.isp) {
      const moveableParentObj = dom.parentElement?.componentModel?.model?.publicAPI?.[option.property];
      if (moveableParentObj?.hasOwnProperty(methodName) && moveableParentObj[methodName](argum)) return true;
    }
    if (moveableObj?.hasOwnProperty(methodName) && moveableObj[methodName](argum)) return true;
    return false;
  }
}
