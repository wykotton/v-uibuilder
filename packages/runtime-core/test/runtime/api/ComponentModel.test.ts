// import $ from "jquery";
// import { cloneDeep, isBoolean, isObject, merge, isEqual, uniqWith, isArray, isFunction } from "lodash-es";
// import JSONfn from "json-fn";
// import { createOptionsView, deepWatchModelProxy, mergeModel, stringifyDeep } from "../../util/utils";
// import { eventBus } from "./EventBus";
// import { IDOMEventMeta, IEventHandlersEventName, ISchema, IWatchSetting, IComponentModel, IMessage } from "@zzjz/v-uibuilder-types";
// import StyleToObject from "style-to-object";

// interface IRelationship {
//   selectedKey: string;
//   src: string;
//   target: string;
//   bindKey: string;
// }

// export class ComponentModel implements IComponentModel {
//   /**
//    * 组件根节点
//    */
//   el!: HTMLElement;
//   /**
//    * 组件model
//    */
//   model: ISchema = {} as ISchema;
//   /**
//    * 变更回调
//    */
//   update: any = new Proxy(
//     {
//       _callback: <Function[]>[],
//       get callback() {
//         return this._callback;
//       },
//       set callback(value) {
//         if (!isFunction(value)) return;
//         const index = this._callback.findIndex((item) => item.toString() === value.toString());
//         index > -1 ? (this._callback[index] = value) : this._callback.push(value);
//       },
//     },
//     {}
//   );

//   constructor(options: IComponentModel) {
//     const { el, model } = options;
//     this.el = el;
//     this.initBaseModel(model);

//     this.domAssemblyCustomEvents(el, model?.onDOMEvent || model?._onDOMEvent);
//     this.connectedCallback();
//     this.model?.lifeCycle?.created?.(this.el, this.model);
//   }

//   /**
//    * 总线消息分发
//    * @param imessage
//    */
//   public onMessage(imessage: IMessage): void {
//     const { header } = imessage;
//     const { dstType } = header;
//     const nativeEvents = `on${dstType}` as IEventHandlersEventName;
//     const DOMEvents = this as never;
//     const nativeEventsHandler = DOMEvents[nativeEvents] as () => void;
//     const customEventsHandler = this.model.onMessageMeta[dstType];

//     if (nativeEventsHandler && nativeEventsHandler.length) {
//       this.el.dispatchEvent(imessage.body);
//       return;
//     }

//     customEventsHandler &&
//       customEventsHandler.forEach((current) => {
//         const fn = current;

//         if (fn) {
//           const cpFn = new Function("imessage", `return (${fn.toString()}).call(this.el,imessage)`);
//           cpFn.call(this, imessage);
//         }
//       });
//   }

//   /**
//    * 发送消息
//    * @param imessage IMessage
//    * @returns
//    */
//   public sendMessage(imessage: IMessage): Promise<any> {
//     const {
//       header: { srcType },
//     } = imessage;
//     const eventName = `on${srcType}` as IEventHandlersEventName;

//     if (this.model.onDOMEvent[eventName]) {
//       this.model.onDOMEvent[eventName].forEach((current) => {
//         const fn = current;
//         if (fn) {
//           const cpFn = new Function("imessage", `return (${fn.toString()}).call(this.el,imessage)`);
//           cpFn.call(this, imessage);
//         }
//       });
//     }
//     return eventBus.sendMessage(imessage);
//   }

//   /**
//    * 获取model的序列化字符串
//    * @retumo 序列化model
//    */
//   public getModelEntity() {
//     return stringifyDeep(this.model);
//   }

//   /**
//    * 更新model实体
//    * @param model
//    */
//   public updateModelEntity(model: string) {
//     const telejsonOld = JSON.parse(this.getModelEntity());
//     const telejsonVal = JSON.parse(model);
//     const changeKeys: string[] = [];

//     // 属性变更
//     Object.keys(telejsonVal).forEach((key: string) => {
//       if (!isEqual(telejsonVal[key], telejsonOld[key])) {
//         changeKeys.push(key);
//       }
//     });
//     changeKeys.forEach((key) => {
//       const setKey = key.substring(1, Infinity);
//       if (key.includes("_") && changeKeys.includes(key.substring(1, Infinity))) {
//         telejsonVal[setKey] = telejsonVal[key];
//       }
//     });
//     const serializationModel = JSONfn.parse(JSON.stringify(telejsonVal));
//     console.log(serializationModel);

//     changeKeys.forEach((key) => {
//       try {
//         const value = serializationModel[key];
//         this.model[key] = value;

//         if (key === "onDOMEvent") {
//           this.domAssemblyCustomEvents(this.el, this.model.onDOMEvent || this.model._onDOMEvent);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     });
//     this.model?.lifeCycle?.updated?.(this.el, this.model);
//   }

//   /**
//    * 获取可以进行属性配置的列表
//    * @returns
//    */
//   public getAttributeList() {
//     return Object.keys(this.model)
//       .map((key) => {
//         return Object.getOwnPropertyDescriptor(this.model, key) as { set: Function };
//       })
//       .filter(({ set }) => set);
//   }

//   /**
//    * 组件创建
//    */
//   private connectedCallback() {
//     const options = {
//       attributes: true,
//     };
//     const callBack = () => {
//       this.model?.lifeCycle?.updated?.(this.el, this.model);
//     };
//     const ob = new MutationObserver(callBack);

//     ob.observe(this.el, options);
//     setTimeout(() => {
//       const initStyle = StyleToObject(this.model.initStyle);
//       if (this?.el?.style && initStyle) {
//         for (const iterator of Object.keys(initStyle)) {
//           if (!this.el.style.getPropertyValue(iterator)) {
//             this.el.style.setProperty(iterator, initStyle[iterator]);
//           }
//         }
//       }
//     }, 0);
//     $(this.el).on("DOMNodeRemoved", () => {
//       // 保证组件仅仅是移动情况不移除事件
//       if (!this.el.isConnected) {
//         $(this.el).off();
//         ob.disconnect();
//         this.model?.lifeCycle?.destroy?.();
//       }
//     });
//   }

//   /**
//    * 初始化model
//    * 注:下划线为内|部变量,不可修改,作为组件默认数据或者初始化数据,其它组件可以覆盖
//    * @param model
//    */
//   private initBaseModel(model = {} as ISchema): void {
//     const self = this;
//     // 创建optionsView描述，进行合并
//     try {
//       if (model?.iovSchema?.optionsView?.model) {
//         model.iovSchema.optionsView.model = createOptionsView(model);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//     this.model = deepWatchModelProxy(
//       mergeModel(
//         {
//           get id() {
//             return cloneDeep(self.el.id);
//           },
//           set id(value) {
//             self.el.setAttribute("id", value);
//           },
//           _initStyle: "height:150px;width:150px;",
//           get initStyle() {
//             return this._initStyle;
//           },
//           set initStyle(value) {
//             this._initStyle = StyleToObject(value);
//             self.el.style.cssText = this._initStyle;
//           },
//           _onMessageMeta: {},
//           _onDOMEvent: {},
//           _onWatchSetting: {},
//           _lifeCycle: {},
//           _contextType: false,
//           _attrBindRelationship: [],
//           _componentAliasName: "",
//           get onMessageMeta() {
//             return cloneDeep(this._onMessageMeta);
//           },
//           set onMessageMeta(value) {
//             if (!isObject(value)) {
//               return;
//             }
//             const mergeValue = merge(this._onMessageMeta, value);
//             this._onMessageMeta = mergeValue;
//           },
//           get onDOMEvent() {
//             return cloneDeep(this._onDOMEvent);
//           },
//           set onDOMEvent(value) {
//             if (!isObject(value)) {
//               return;
//             }
//             self.domAssemblyCustomEvents(self.el, value as IDOMEventMeta);
//             this._onDOMEvent = value;
//           },
//           get onWatchSetting() {
//             return cloneDeep(this._onWatchSetting);
//           },
//           set onWatchSetting(value: IWatchSetting) {
//             if (!isObject(value)) {
//               return;
//             }
//             const mergeValue = merge(this._onWatchSetting, value);
//             this._onWatchSetting = mergeValue;
//           },
//           get lifeCycle() {
//             return this._lifeCycle;
//           },
//           set lifeCycle(value) {
//             this._lifeCycle = value;
//           },
//           get contextType() {
//             return this._contextType;
//           },
//           set contextType(value) {
//             if (!isBoolean(value)) {
//               throw new Error("contextType必须是boolean类型");
//             }
//             this._contextType = value;
//           },
//           get attrBindRelationship() {
//             return this._attrBindRelationship;
//           },
//           set attrBindRelationship(value: IRelationship | IRelationship[]) {
//             if (!isObject(value)) return;
//             if (isArray(value)) {
//               this._attrBindRelationship = uniqWith([...this.attrBindRelationship, ...value], isEqual);
//               return;
//             }
//             this._attrBindRelationship = uniqWith([...this.attrBindRelationship, value], isEqual);
//           },
//           get componentAliasName() {
//             return this._componentAliasName;
//           },
//           set componentAliasName(value) {
//             this._componentAliasName = value;
//           },
//         },
//         model
//       ),
//       undefined,
//       null,
//       this.update,
//       ""
//     );
//   }

//   /**
//    * 挂载model中自定义的原生事件
//    * @param DOM
//    * @param events
//    * @returns
//    */
//   private domAssemblyCustomEvents(DOM: HTMLElement, events: IDOMEventMeta) {
//     if (!DOM || !events) return;
//     $(DOM).off();
//     Object.keys(events).forEach((eventName) => {
//       // 只取数组对象中第一个的值
//       const fnArrs = events[eventName as IEventHandlersEventName];
//       if (fnArrs && fnArrs.length > 0) {
//         fnArrs
//           .map((fn) => {
//             $(DOM).off(eventName as any);
//             return fn;
//           })
//           .forEach((fn) => {
//             $(DOM).on(eventName as any, function (e: any) {
//               const event = Object.defineProperties({}, Object.getOwnPropertyDescriptors(e));
//               fn && fn.call(DOM, event as any);
//             });
//           });
//       } else {
//         $(DOM).off(eventName as any);
//       }
//     });
//   }
// }
