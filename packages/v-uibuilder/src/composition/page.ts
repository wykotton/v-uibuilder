import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { saveInfo, updateInfo } from "@/api/uibuilder/edit";
import { isEqual, debounce, throttle } from "lodash-es";
import { ISchema } from "@/types/IModelSchema";
import { message, notification } from "ant-design-vue";
import { changeSetter } from "./setting";
import { usePluginStoreWithOut } from "@/store/modules/plugin";
import { useUserStoreWithOut } from "@/store/modules/user";
import { stringify } from "telejson";
import { createHashId } from "@/utils/uuid";
import { getTrees, setNeedToExpandKeys } from "./tree";
import { useMutationObserver } from "@vueuse/core";
import { recordSnapshot } from "./header";
import { getNotSVGElement, isSVGElement } from "@/utils/utils";
import { isElement } from "lodash-es";
import { CanvasIdEnum } from "@/enums/appEnum";
import $ from "jquery";

// pinia
const useAppStore = useAppStoreWithOut();
const useUserStore = useUserStoreWithOut();
const useSettingStore = useSettingStoreWithOut();
const usePluginStore = usePluginStoreWithOut();

/**
 * 页面焦点状态
 */
export function addFocusEvents() {
  document.addEventListener("click", () => {
    const tagName = document.activeElement?.tagName;
    const focusArr = [
      "INPUT",
      "TEXTAREA",
      "Q-CODE-EDITOR",
      "Q-ATTRIBUTE-SETTING",
      "Q-STYLE-SETTING",
      "Q-EVENT-SETTING",
    ];
    if (tagName && focusArr.includes(tagName)) {
      useAppStore.setIsFocus(true);
    } else {
      useAppStore.setIsFocus(false);
    }
  });
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
    autoSavePage();
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
    let innerHTML = element.innerHTML;
    // 移除moveable的辅助框DOM
    const moveableDOM = element.querySelector(".moveable-control-box");
    if (moveableDOM) {
      innerHTML = innerHTML.replace(moveableDOM.outerHTML, "");
    }
    // 移除selecto的辅助框DOM
    const selectoDOM = element.querySelector(".selecto-selection");
    if (selectoDOM) {
      innerHTML = innerHTML.replace(selectoDOM.outerHTML, "");
    }
    return innerHTML;
  } else {
    return "not found";
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
  const userInfo = useUserStore.getUibUserInfo;
  if (!userInfo?.id) {
    if (!ignore) {
      notification.destroy();
      notification.warning({
        message: "用户id不存在!",
      });
    }
    return;
  }
  return new Promise<void>(async (resolve, reject) => {
    const tempObj = {
      DesignerPage: getPageInfo(),
      theme: {
        disableWarehouse: useAppStore.disableWarehouse,
      },
      id,
      userId: userInfo.id,
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
const autoSavePage = throttle(() => {
  const id = useAppStore?.pageInstance?.id;
  if (!id || !useAppStore?.editStatus) return;
  savePage(Number(id), true);
}, 3000);

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
    dynamicHTML: innerDropzoneHtml,
    pluginHTML: bottomDropzoneHtml,
  };
  const pageInfo = JSON.parse(stringify(tempData));
  pageInfo.componentsArray.forEach((item: ISchema) => {
    checkComponentModel(item);
  });
  return pageInfo;
}

/**
 * 设置组件选中数据
 * @param {*} element
 */
export function setFocus(e: any) {
  const element = e.currentTarget;
  if (!element) return;
  if (useAppStore.isCtrlKey) {
    const focusId = useAppStore.pageModel?.checkFocus(element.id);
    if (!focusId) {
      // 更新图层面板选中项
      useAppStore.pageModel?.addSelected([element.id]);
      const focusElement = useAppStore.pageModel?.selectedComponents.map((component: ISchema) => component.id);
      if (!isEqual(useSettingStore.selectedKeys, focusElement)) {
        useSettingStore.setSelectedKeys(focusElement);
        if (focusElement.length === 1) {
          // 更新设置器
          changeSetter(useAppStore.pageModel?.currentComponent, ["all"]);
        } else {
          // 多选时，不更新设置器，只更新moveable实例
          changeSetter(useAppStore.pageModel?.currentComponent, ["moveable"]);
        }
      }
    }
    return;
  }
  const focusElement = [element.id];
  useAppStore?.pageModel.clearSelected();
  useAppStore?.pageModel.addSelected(focusElement);
  if (!isEqual(useSettingStore.selectedKeys, focusElement)) {
    // 更新图层面板选中项
    useSettingStore.setSelectedKeys(focusElement);
    // 更新设置器
    changeSetter(useAppStore.pageModel?.currentComponent, ["attribute", "style", "domEvent"]);
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
 * 组件mousedown(鼠标左键)
 * 只能选中非容器子组件
 * @param e
 * @returns
 */
export function onClickComponent(e: any) {
  let clickElement = e.currentTarget?.shadowRoot?.activeElement ?? e.originalEvent.path[0];

  if (isSVGElement(clickElement)) {
    clickElement = getNotSVGElement(e.originalEvent.path);
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

  // 元件设计时状态才开启拖拽
  if (!e.currentTarget.componentModel.model.contextType) {
    e.stopPropagation();
    e.preventDefault();
    if (isElement(clickElement)) {
      clickElement?.click && clickElement.click();
    }
    if (!useAppStore.isCtrlKey) {
      // 设置moveable实例，开启拖拽
      useSettingStore.moveableExample.setMoveableTarget(e, true);
    }
  }
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

  // 元件设计时状态才更新moveable对象
  if (!e.currentTarget.componentModel.model.contextType) {
    e.stopPropagation();
    e.preventDefault();
    if (!useAppStore.isCtrlKey) {
      // 设置moveable实例
      useSettingStore.moveableExample.setMoveableTarget(e);
    }
  }
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
  // 点击组件时防止冒泡触发此方法
  if (e && (e.target.classList.contains("draggable2") || $(e.target).parents(".draggable2").length)) return;
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
export function useCloneComponent() {
  if (useAppStore?.pageModel?.selectedComponents.length === 1) {
    const currentModel = useAppStore.pageModel.currentComponent;
    const component = document.querySelector(`#${currentModel.id}`) as any;
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
    component.parentElement.appendChild(element);
    componentsArray.forEach((item: ISchema) => {
      useAppStore.pageModel.add(item);
    });
    // 更新组件选中数据
    useAppStore.pageModel?.clearSelected();
    useAppStore.pageModel?.addSelected([element.id]);
    // 更新设置器和moveable实例
    changeSetter(element.componentModel.model, ["all"]);
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
    const tempComponent = document.querySelector(`#${element.id}`) as any;
    if (!tempComponent || !tempComponent.componentModel) return;
    const elementModel = JSON.parse(stringify(tempComponent.componentModel.model));
    const id = (element.id = createHashId(12, element.tagName));
    element.id = id;
    elementModel.id = id;
    // 兼容DI Angular组件创建后不初始化的问题
    if (element && !element.componentModel && element.connectedCallback) {
      element?.connectedCallback();
    }
    element.componentModel.updateModelEntity(JSON.stringify(elementModel));
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
