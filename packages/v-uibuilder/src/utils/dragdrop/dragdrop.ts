import $ from "jquery";
import { isElement, isNumber, isObject, isString } from "lodash-es";
import { createHashId } from "../uuid";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import {
  getTrees,
  changeSetter,
  changeContainer,
  recordSnapshot,
  setNeedToExpandKeys,
  componentsAction,
  checkCombinationComponent,
  createCombinationComponent,
  changeInitStyle,
} from "@/composition/index";
import { message } from "ant-design-vue";
import { ISchema } from "@/types/IModelSchema";
import { findCombinationApi } from "@/api/uibuilder/edit";
import { usePluginStoreWithOut } from "@/store/modules/plugin";
import { CanvasIdEnum, ComponentProtocolEnum, EInitModelEnum } from "@/enums/appEnum";
import { ChangeSetterEnum } from "@/enums/settingEnum";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();
const usePluginStore = usePluginStoreWithOut();

/**
 *  拖放对象
 */
class DragDrop {
  /**
   * 选中标签名
   */
  elementTag = null;
  /**
   * 选中元件
   */
  component = null;
  /**
   * 切换容器
   */
  changeContainerState = false;
  /**
   * eventsMap
   */
  eventsMap = new Map();

  dragStart(el: string | HTMLElement) {
    let element = null;
    if (isElement(el) && !isString(el)) {
      element = el;
    } else if (isString(el)) {
      element = document.querySelector(el);
    }

    if (!element) return;

    const ele = $(element);
    $(ele).on("drag", "li", (e) => {
      this.elementTag = e.target.dataset.tag;
      this.component = e.target.component;
    });
  }

  dropStart(el: string | HTMLElement) {
    let element = null;
    if (isElement(el) && !isString(el)) {
      element = el;
    } else if (isString(el)) {
      element = document.querySelector(el);
    }

    if (!element) return;

    const ele = $(element);

    $(ele)
      .on("drop", (e) => {
        this.emit(DragDropEventEnum.DROPSTART, {
          dragStart: true,
          target: e?.target,
          currentTarget: e?.currentTarget,
        });
        this.drop(e);
        return false;
      })
      .on("dragover", (e) => {
        e.preventDefault();
      });
  }

  /**
   * 拖动对象
   * @param e
   */
  drag(e: DragEvent) {
    if (!e.dataTransfer) return;

    const dom = e.target as HTMLElement;
    e.dataTransfer.setData("Text", dom?.id);
  }

  async drop(e: any) {
    try {
      e.preventDefault();
      e.stopPropagation();
      // 处理组件降落点和坐标
      const { slotName, target, left, top } =
        (e.target.localName === "q-container-mask" || e.target.localName === this.elementTag) &&
        this.elementTag === "q-modal"
          ? { slotName: "", target: document.getElementById("inner-dropzone"), left: 0, top: 0 }
          : this.checkDropzone(e);
      // 组件切换容器
      if (this.changeContainerState) {
        changeContainer(slotName, target, left, top);
        this.changeContainerState = false;
        return;
      }
      // 关闭插件区抽屉
      usePluginStore.closeFixedMenu();
      // 自定义元件单独处理
      if (this.elementTag === "my-component") {
        await this.handleCombination(
          {
            tag: this.elementTag,
            component: this.component,
            slotName: slotName,
            insetElement: target,
          },
          left,
          top
        );
        return;
      }
      // 组件拖入画布
      const element = await this.createComponent({
        tag: this.elementTag,
        component: this.component,
        slotName: slotName,
        insetElement: target,
        currentTarget: e?.currentTarget,
      });
      // 重置数据，防止数据留存
      this.elementTag = null;
      this.component = null;
      // 组件赋能
      const componentModel = this.powerByComponent(element, left, top);
      if (componentModel?.model) this.updateExampleData(componentModel);
      // 对首次着陆画布组件做处理
      element?.dropCreated?.(this);
    } catch (error) {
      console.log(error);
    } finally {
      this.emit(DragDropEventEnum.DROPEND, {
        dragEnd: true,
        target: e?.target,
        currentTarget: e?.currentTarget,
      });
    }
  }

  /**
   * 组件创建层
   * @param options
   * @returns
   */
  async createComponent(options: { [key: string]: any } = {}) {
    const { component = {}, insetElement, slotName } = options;
    const { options: componentOptions = {}, componentName = "" } = component;
    try {
      if (!componentName) {
        console.error("元件标签不存在!");
        return;
      } else if (!useAppStore?.pageModel?.pageModel) {
        message.error("页面实例创建失败!请刷新页面或者重新创建页面!");
      }
      componentsAction("uib", {
        type: ComponentProtocolEnum.REGISTER,
        body: {
          fn: useAppStore.pageModel.pageModel.defineCustomWebcomponent,
          fnData: component,
        },
      });
      let createElement = () => {
        const element = document.createElement(componentName);
        if (!element) return null;
        // 兼容DI Angular组件创建后不初始化的问题
        if (element && !element.componentModel && element.connectedCallback) {
          element?.connectedCallback();
          element?.componentModel?.model?.lifeCycle?.updated?.(element, componentOptions, EInitModelEnum.INITBASEMODEL);
          Reflect.deleteProperty(componentOptions, "iovSchema");
        }

        element?.componentModel?.updateModelEntity?.(JSON.stringify(componentOptions));
        if (slotName) element.slot = slotName;
        insetElement.appendChild(element);
        return element;
      };
      let component_loading_timeout = Number(useAppStore.designerConfig?.component_loading_timeout);
      if (!isNumber(component_loading_timeout)) {
        component_loading_timeout = 5;
      }
      const loadTimeout = setTimeout(() => {
        // 元件加载超时
        message.destroy();
        message.error("元件加载超时, 请重试!");
        this.emit(DragDropEventEnum.DROPEND, {
          dragEnd: true,
          target: options?.insetElement,
          currentTarget: options?.currentTarget,
        });
        createElement = () => {
          return null;
        };
      }, component_loading_timeout * 1000);
      // 正常加载
      await customElements.whenDefined(componentName);
      clearTimeout(loadTimeout);
      return createElement();
    } catch (error) {
      console.log(error);
      this.emit(DragDropEventEnum.DROPEND, {
        dragEnd: true,
        target: options?.insetElement,
        currentTarget: options?.currentTarget,
      });
      return null;
    }
  }

  /**
   * 组件赋能
   * @param element
   */
  powerByComponent(element: HTMLElement, left?: number, top?: number) {
    if (!element) return null;
    const elementAny = element as any;
    if (isNumber(left) && isNumber(top)) {
      const cssText = `position: absolute;left: ${left}px;top: ${top}px;`;
      const initStyle = elementAny?.componentModel?.model?.initStyle;
      const newInitStyle = changeInitStyle(cssText, initStyle, ["position", "left", "top"]);
      elementAny.style.cssText = newInitStyle;
      elementAny.componentModel.model.initStyle = newInitStyle;
    }
    element.classList.add("draggable2");
    element.id = createHashId(12, element.tagName);
    element.setAttribute("data-element-type", element.tagName);
    return elementAny.componentModel;
  }

  /**
   * 检查组件降落点
   * 获取降落坐标
   * @param e
   */
  checkDropzone(e: any) {
    const canvas = [CanvasIdEnum.INNER, CanvasIdEnum.BOTTOM];
    const { offsetX, offsetY, clientX, clientY } = e;
    if (canvas.includes(e.target.id)) {
      return { slotName: "", target: e.target, left: offsetX, top: offsetY };
    } else {
      if (!e?.originalEvent?.composedPath?.()?.length) {
        message.error("组件drop数据出错!");
      }
      let slot: HTMLSlotElement | null = null;
      let component: HTMLElement | null = null;
      const { offsetLeft, offsetTop } = e.target;
      for (const element of e.originalEvent?.composedPath?.() ?? []) {
        if (slot && component) {
          break;
        }
        // 查找到画布后就终止
        if (element?.id && canvas.includes(element.id)) {
          // if ($(element).hasClass('dropzone')) {
          component = element;
          break;
        }
        if (!slot && element?.tagName === "SLOT" && element?.classList?.contains("dropzone")) {
          slot = element;
        }
        if (slot && !component && element?.classList?.contains?.("draggable2")) {
          component = element;
        }
      }
      if (!component) {
        message.error("组件drop操作出错, 降落点检查错误!");
        return { slotName: "", target: null, left: 0, top: 0 };
      }
      let left = 0;
      let top = 0;
      // if (e.target === component) {
      //   // 直接降落在容器里
      //   left = offsetX;
      //   top = offsetY;
      // } else {
      //   // 降落在非容器元件上
      //   left = offsetX + offsetLeft;
      //   top = offsetY + offsetTop;
      // }
      if (slot) {
        // 直接降落在容器里
        const { left: slotLeft, top: slotTop } = slot.getBoundingClientRect();
        // 需要处理画布缩放系数
        left = (clientX - slotLeft) / useAppStore.scaleNum;
        top = (clientY - slotTop) / useAppStore.scaleNum;
      } else {
        // 降落在非容器元件上
        left = offsetX + offsetLeft;
        top = offsetY + offsetTop;
      }
      if (slot) {
        const slotName = slot.getAttribute("name") || "";
        return { slotName, target: component, left, top };
      } else {
        return { slotName: "", target: component, left, top };
      }
    }
  }

  /**
   * 更新相关实例数据
   * @param component
   */
  async updateExampleData(component: any) {
    const model = component.model as ISchema;
    useAppStore.pageModel.pageModel.setComponentsPageModel(model);
    // 更新组件选中数据
    useAppStore.pageModel?.clearSelected();
    await useAppStore.pageModel?.addSelected([model.id]);
    // 更新设置器和moveable实例
    const changeSetterArr = model?._iovSchema?.changeSetter;
    if (changeSetterArr instanceof Array && changeSetterArr.length) changeSetter(model, changeSetterArr);
    else changeSetter(model, [ChangeSetterEnum.ALL]);
    // 更新图层面板
    useSettingStore.setTreeData(getTrees());
    setNeedToExpandKeys();
    useSettingStore.setSelectedKeys([model.id]);
    // 添加快照
    recordSnapshot();
  }

  /**
   * 元件集合处理
   * @param options
   */
  async handleCombination(options: { [key: string]: any } = {}, left: number, top: number) {
    let { component = {} } = options;
    const { insetElement, slotName } = options;
    if (!component.id) {
      message.destroy();
      message.error("元件集合id不存在!");
      return;
    }
    const res = await findCombinationApi({ ids: [component.id] });
    const {
      results,
      info: { msg = "" },
    } = res.data;
    if (msg === "success" && results[0]) {
      component = results[0];
    } else {
      message.error("元件集数据获取失败!");
      return;
    }
    const notFind = await checkCombinationComponent(component);
    if (notFind) {
      message.destroy();
      message.error("无法找到元件集合子组件, 请检查元件仓库!");
      return;
    }
    component.slotName = slotName;
    await createCombinationComponent(component, insetElement, left, top);
    // 重置数据，防止数据留存
    this.elementTag = null;
    this.component = null;
    // 更新图层面板
    useSettingStore.setTreeData(getTrees());
    setNeedToExpandKeys();
    // 添加快照
    recordSnapshot();
  }
  dropEventMount(dom: HTMLElement) {
    const dropzoneDoms = dom?.shadowRoot?.querySelectorAll(".dropzone") || [];
    for (let i = 0; i < dropzoneDoms.length; i++) {
      const element = dropzoneDoms[i] as HTMLElement;
      this.dropStart(element);
    }
  }

  /**
   * 暴露给外部监听
   * @param event 事件
   * @param listener 监听函数
   */
  on = (event: DragDropEventType, listener: Function) => {
    if (!isObject(this.eventsMap.get(event))) {
      this.eventsMap.set(event, []);
    }
    this.eventsMap.get(event).push(listener);
  };

  /**
   * 事件发射器
   * @param event 事件类型
   * @param args 参数
   */
  emit = (event: DragDropEventType, ...args: any[]) => {
    if (isObject(this.eventsMap.get(event))) {
      this.eventsMap.get(event).forEach((listener: Function) => {
        listener.apply(this, args);
      });
    }
  };
}

type DragDropEventType = DragDropEventEnum[keyof DragDropEventEnum];

export enum DragDropEventEnum {
  DROPSTART = "dropStart",
  DROPOVER = "dropOver",
  DROPEND = "dropEnd",
}

export const dragDrop = new DragDrop();
