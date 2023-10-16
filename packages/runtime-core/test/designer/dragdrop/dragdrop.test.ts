// import { EInitModelEnum } from "@zzjz/v-uibuilder-types";
// import { message } from "ant-design-vue";
// import $ from "jquery";
// import { isElement, isNumber, isObject, isString } from "lodash-es";
// import { getComponents } from "../../depot-protocol/depot";
// import { createHashId, isPromise } from "../../util";
// import { changeInitStyle } from "../style-setting";
// import { checkCombinationComponent, createCombinationComponent } from "./combination";
// import { changeContainer } from "./component-drag-drop";

// /**
//  *  拖放对象
//  */
// export class DragDrop {
//   /**
//    * 选中标签名
//    */
//   elementTag = null;
//   /**
//    * 选中元件
//    */
//   component = null;
//   /**
//    * 切换容器
//    */
//   changeContainerState = false;
//   /**
//    * eventsMap
//    */
//   eventsMap = new Map();
//   /**
//    * 主画布
//    */
//   canvas;

//   constructor({ canvas }: { canvas: HTMLElement }) {
//     this.canvas = canvas;
//   }

//   dragStart(el: string | HTMLElement) {
//     let element = null;
//     if (isElement(el) && !isString(el)) {
//       element = el;
//     } else if (isString(el)) {
//       element = document.querySelector(el);
//     }

//     if (!element) return;

//     const ele = $(element);
//     $(ele).on("drag", "li", (e) => {
//       this.elementTag = e.target.dataset.tag;
//       this.component = e.target.component;
//     });
//   }

//   dropStart(el: string | HTMLElement) {
//     let element = null;
//     if (isElement(el) && !isString(el)) {
//       element = el;
//     } else if (isString(el)) {
//       element = document.querySelector(el);
//     }

//     if (!element) return;

//     const ele = $(element);

//     $(ele)
//       .on("drop", (e) => {
//         this.emit(DragDropEventEnum.DROPSTART, {
//           dragStart: true,
//           target: e?.target,
//           currentTarget: e?.currentTarget,
//         });
//         this.drop(e);
//         return false;
//       })
//       .on("dragover", (e) => {
//         e.preventDefault();
//       });
//   }

//   /**
//    * 拖动对象
//    * @param e
//    */
//   drag(e: DragEvent) {
//     if (!e.dataTransfer) return;

//     const dom = e.target as HTMLElement;
//     e.dataTransfer.setData("Text", dom?.id);
//   }

//   async drop(e: any) {
//     try {
//       e.preventDefault();
//       e.stopPropagation();
//       // 处理组件降落点和坐标
//       const { slotName, target, left, top } = this.checkDropzone(e);
//       // 组件切换容器
//       if (this.changeContainerState) {
//         changeContainer(slotName, target, left, top);
//         this.changeContainerState = false;
//         return;
//       }
//       // 自定义元件单独处理
//       if (this.elementTag === "my-component") {
//         await this.handleCombination(
//           {
//             tag: this.elementTag,
//             component: this.component,
//             slotName: slotName,
//             insetElement: target,
//           },
//           left,
//           top
//         );
//         return;
//       }
//       // 组件拖入画布
//       const element = await this.createComponent({
//         tag: this.elementTag,
//         component: this.component,
//         slotName: slotName,
//         insetElement: target,
//         currentTarget: e?.currentTarget,
//       });
//       // 重置数据，防止数据留存
//       this.elementTag = null;
//       this.component = null;
//       // 组件赋能
//       // const componentModel = this.powerByComponent(element, left, top);
//       // 对首次着陆画布组件做处理
//       element?.dropCreated?.(this);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       this.emit(DragDropEventEnum.DROPEND, {
//         dragEnd: true,
//         target: e?.target,
//         currentTarget: e?.currentTarget,
//       });
//     }
//   }

//   /**
//    * 组件创建层
//    * @param options
//    * @returns
//    */
//   async createComponent(options: { [key: string]: any } = {}) {
//     const { component = {}, insetElement, slotName } = options;
//     const { options: componentOptions = {}, componentName = "" } = component;
//     try {
//       if (!componentName) {
//         console.error("元件标签不存在!");
//         return;
//       }
//       await customElements.whenDefined(componentName);
//       const element = document.createElement(componentName);
//       if (!element) return;

//       // 兼容DI Angular组件创建后不初始化的问题
//       if (element && !element.componentModel && element.connectedCallback) {
//         element?.connectedCallback();
//         element?.componentModel?.model?.lifeCycle?.updated?.(element, componentOptions, EInitModelEnum.INITBASEMODEL);
//         Reflect.deleteProperty(componentOptions, "iovSchema");
//       }

//       element?.componentModel?.updateModelEntity?.(JSON.stringify(componentOptions));
//       if (slotName) element.slot = slotName;
//       insetElement.appendChild(element);
//       return element;
//     } catch (error) {
//       console.log(error);
//       this.emit(DragDropEventEnum.DROPEND, {
//         dragEnd: true,
//         target: options?.insetElement,
//         currentTarget: options?.currentTarget,
//       });
//       return null;
//     }
//   }

//   /**
//    * 组件赋能（样式，ID，类型）
//    * @param element
//    */
//   powerByComponent(element: HTMLElement, left?: number, top?: number) {
//     if (!element) return;
//     const elementAny = element as any;
//     if (isNumber(left) && isNumber(top)) {
//       const cssText = `position: absolute;left: ${left}px;top: ${top}px;z-index:1;`;
//       const initStyle = elementAny?.componentModel?.model?.initStyle;
//       const newInitStyle = changeInitStyle(cssText, initStyle, ["position", "left", "top", "z-index"]);
//       elementAny.style.cssText = newInitStyle;
//       elementAny.componentModel.model.initStyle = newInitStyle;
//     }
//     element.classList.add("draggable2");
//     element.id = createHashId(12, element.tagName);
//     element.setAttribute("data-element-type", element.tagName);
//     return elementAny.componentModel;
//   }

//   /**
//    * 检查组件降落点
//    * 获取降落坐标
//    * @param e
//    */
//   checkDropzone(e: any) {
//     const { offsetX, offsetY, clientX, clientY } = e;
//     // const checkMap = this.emit(DragDropEventEnum.CHECKDROPZONE, e);
//     if (this.canvas.id === e.target.id) {
//       return { slotName: "", target: e.target, left: offsetX, top: offsetY };
//     }
//     if (!e?.originalEvent?.composedPath?.()?.length) {
//       message.error("组件drop数据出错!");
//     }
//     let slot: HTMLSlotElement | null = null;
//     let component: HTMLElement | null = null;
//     const { offsetLeft, offsetTop } = e.target;
//     for (const element of e.originalEvent?.composedPath?.() ?? []) {
//       if (slot && component) {
//         break;
//       }
//       // 查找到画布后就终止
//       if (element?.id && this.canvas.id === element.id) {
//         component = element;
//         break;
//       }
//       if (!slot && element?.tagName === "SLOT" && element?.classList?.contains("dropzone")) {
//         slot = element;
//       }
//       if (slot && !component && element?.classList?.contains?.("draggable2")) {
//         component = element;
//       }
//     }
//     if (!component) {
//       message.error("组件drop操作出错, 降落点检查错误!");
//       return { slotName: "", target: null, left: 0, top: 0 };
//     }
//     let left = 0;
//     let top = 0;
//     if (slot) {
//       // 直接降落在容器里
//       const { left: slotLeft, top: slotTop } = slot.getBoundingClientRect();
//       left = clientX - slotLeft;
//       top = clientY - slotTop;
//     } else {
//       // 降落在非容器元件上
//       left = offsetX + offsetLeft;
//       top = offsetY + offsetTop;
//     }
//     if (slot) {
//       const slotName = slot.getAttribute("name") || "";
//       return { slotName, target: component, left, top };
//     } else {
//       return { slotName: "", target: component, left, top };
//     }
//   }

//   /**
//    * 元件集合处理
//    * @param options
//    */
//   async handleCombination(options: { [key: string]: any } = {}, left: number, top: number) {
//     let { component = {} } = options;
//     const { insetElement, slotName } = options;
//     if (!component.id) {
//       message.destroy();
//       message.error("元件集合id不存在!");
//       return;
//     }
//     const res = {} as any;
//     const {
//       results,
//       info: { msg = "" },
//     } = res.data;
//     if (msg === "success" && results[0]) {
//       component = results[0];
//     } else {
//       message.error("元件集数据获取失败!");
//       return;
//     }
//     const notFind = await checkCombinationComponent(component, getComponents());
//     if (notFind) {
//       message.destroy();
//       message.error("无法找到元件集合子组件, 请检查元件仓库!");
//       return;
//     }
//     component.slotName = slotName;
//     await createCombinationComponent(component, insetElement, left, top);
//     // 重置数据，防止数据留存
//     this.elementTag = null;
//     this.component = null;
//   }

//   dropEventMount(dom: HTMLElement) {
//     const dropzoneDoms = dom?.shadowRoot?.querySelectorAll(".dropzone") || [];
//     for (const item of dropzoneDoms) {
//       const element = item as HTMLElement;
//       this.dropStart(element);
//     }
//   }

//   /**
//    * 暴露给外部监听
//    * @param event 事件
//    * @param listener 监听函数
//    */
//   on = (event: DragDropEventType, listener: Function | Promise<any>) => {
//     if (!isObject(this.eventsMap.get(event))) {
//       this.eventsMap.set(event, []);
//     }
//     this.eventsMap.get(event).push(listener);
//   };

//   /**
//    * 事件发射器
//    * @param event 事件类型
//    * @param args 参数
//    */
//   emit = (event: DragDropEventType, ...args: any[]) => {
//     if (isObject(this.eventsMap.get(event))) {
//       return this.eventsMap.get(event).map(async (listener: Function | Promise<any>) => {
//         if (isPromise(listener)) {
//           return await listener;
//         }
//         return listener.apply(this, args);
//       });
//     }
//     return null;
//   };
// }

// type DragDropEventType = DragDropEventEnum[keyof DragDropEventEnum];

// export enum DragDropEventEnum {
//   DROPSTART = "dropStart",
//   DROPOVER = "dropOver",
//   DROPEND = "dropEnd",
//   CHECKDROPZONE = "checkDropzone",
// }
