import { IMessage } from "./IMessage";
import { MoveableOptions } from "moveable";

export interface ISchema {
  // 组件ID
  get id(): string;

  set id(value: string);

  // 组件样式
  get initStyle(): string;

  set initStyle(value: string);

  // 组件输入输出schema信息
  get iovSchema(): IIOVSchema;

  // 组件自定义消息事件
  get onMessageMeta(): IMessageMeta;

  set onMessageMeta(value: IMessageMeta);

  // 组件内|部dom事件
  get onDOMEvent(): IDOMEventMeta;

  set onDOMEvent(value: IDOMEventMeta);

  // 组件监听设置
  get onWatchSetting(): IWatchSetting;

  set onWatchSetting(value: IWatchSetting);

  // 组件自定义属性设置器(注:接收一个webcomponent组件的实例负责渲染完成属性设置)
  get attributeSetting(): ISchema;

  set attributeSetting(value: ISchema);

  // 生命周期
  set lifeCycle(value: ILifeCycle);

  get lifeCycle(): ILifeCycle;

  // 组件状态(注:运行时还是设计时,主要给设计时使用防止鼠标事件被组件捕获)
  set contextType(value: boolean);

  get contextType(): boolean;

  // 元件从库拖拽到画布的生命周期，有问题，未实装，建议放到组件属性配置中
  set publicAPI(value: IPublicAPI);

  get publicAPI(): IPublicAPI;

  //版本
  //set version(value:string)
  get version(): string;

  [key: string]: any;
}

type ILifeCycle = {
  created: (el: HTMLElement, model: ISchema) => void;
  updated: (el: HTMLElement, model: ISchema, type?: string) => void;
  destroy: () => void;
};
type IEventHandler = (e: IMessage) => void;
type IWatchFn = (newVal: any, oldVal: any, component: any) => void;

export type IWatchSetting = { [key: string]: IWatchFn[] };
export type IEventHandlersEventName = `on${keyof GlobalEventHandlersEventMap}`;
export type IDOMEventMeta = { [key in IEventHandlersEventName]: IEventHandler[] };
export type IMessageMeta = { [key: string]: IEventHandler[] };

/**
 * 元件类型
 */
export enum EComponentType {
  TEXT = "文本",
  FROM = "表单",
  MEDIA = "媒体",
  CONTAINER = "容器",
  CHART = "图元",
  DATASOURCE = "数据源",
  PLUGIN = "插件",
  CUSTOM = "自定义",
}

/**
 * 元件分组
 */
export enum EComponentGroup {
  BASIC = "UIB原子元件",
  CHART = "图表元件",
  DIBUSINESS = "DI业务元件",
}

type IComponentType = keyof typeof EComponentType;
type IComponentGroup = keyof typeof EComponentGroup;

export interface IIOVSchema {
  // 组件名称
  get componentName(): string;

  // 组件类型
  get type(): IComponentType;

  // 组件文本
  get text(): string;

  // 组件分组
  get group(): IComponentGroup[];

  // 组件创建时间
  get createTime(): Date;

  // 组件缺省图片
  get image(): string;

  // 组件描述文本
  get description(): string;

  // 组件特性 ["all","attribute","style","event","moveable"]
  get changeSetter(): string;

  // 版本号
  get version(): string;

  // 事件规范
  eventSpecification: {
    // 输入事件
    inputMessage: IEventSpecificationEvent[];
    // 输出事件
    outputMessage: IEventSpecificationEvent[];
  };
  optionsView: {
    // 输入选项
    model: Customype;
  };
}

// 基础的类型接口，包含 type 和 description 属性
interface BaseType {
  type: string;
  description: string;
  format?: "text" | "textarea" | "date" | "date-time" | "code" | "style" | "custom"; 
}

// 字符串类型接口，继承基础类型接口，并添加 maxLength, format 和 enum 属性
interface StringType extends BaseType {
  type: "string";
  maxLength?: number; 
  enum?: string[];
}

// 数字类型接口，继承基础类型接口
interface NumberType extends BaseType {
  type: "number";
  maximum?: number;
  minimum?: number;
  enum?: number[];
}

// 布尔类型接口，继承基础类型接口
interface BooleanType extends BaseType {
  type: "boolean";
}

// 数组类型接口，继承基础类型接口，并添加 items 属性
interface ArrayType extends BaseType {
  type: "array";
  items: ComponentType;
}

// 对象类型接口，继承基础类型接口，并添加 properties 属性
interface ObjectType extends BaseType {
  type: "object";
  properties: Record<string, ComponentType>;
}

interface Customype extends BaseType {
  type: "object";
  properties: Record<string, ComponentType>;
  setter: string
}

// 元件类型
type ComponentType = StringType | NumberType | BooleanType | ArrayType | ObjectType | Customype;

export interface IEventSpecificationEvent {
  // 显示文本
  text: string;
  // 时间类型
  eventType: string;
  // 时间schema
  messageSchema: string;
  // 示例
  messageDemo: string;
}

type IDragDrop = {
  // 拖拽前触发
  dragstart: (el: string | HTMLElement) => void;
  // 拖拽前、拖拽结束之间，连续触发
  drag: (e: DragEvent, el: HTMLElement) => void;
  // 拖拽结束触发
  dragend: (e: DragEvent, el: HTMLElement) => void;
  // 进入目|标元素触发，相当于mouseover
  dragenter: (e: DragEvent, el: HTMLElement) => void;
  // 进入目|标、离开目|标之间，连续触发
  dragover: (e: DragEvent, el: HTMLElement) => void;
  // 离开目|标元素触发，，相当于mouseout
  dragleave: (e: DragEvent, el: HTMLElement) => void;
  // 在目|标元素上释放鼠标触发
  dropStart: (el: string | HTMLElement) => void;
  // 在目|标元素上释放鼠标触发
  drop: (e: DragEvent, el: HTMLElement) => void;
};

type IMoveable = {
  // 拖拽单目|标前触发
  dragStart: (e: DragEvent) => void;
  // 拖拽单目|标前、拖拽结束之间，连续触发
  drag: (e: DragEvent) => void;
  // 拖拽单目|标结束触发
  dragEnd: (e: DragEvent) => void;
  // 拖拽多目|标前触发
  dragGroupStart: (e: DragEvent) => void;
  // 拖拽多目|标前、拖拽结束之间，连续触发
  dragGroup: (e: DragEvent) => void;
  // 拖拽多目|标后触发
  dragGroupEnd: (e: DragEvent) => void;
  // 调整单目|标大小前触发
  resizeStart: (e: DragEvent) => void;
  // 调整单目|标大小过程中触发
  resize: (e: DragEvent) => void;
  // 调整单目|标大小后触发
  resizeEnd: (e: DragEvent) => void;
  // 调整多目|标大小前触发
  resizeGroupStart: (e: DragEvent) => void;
  // 调整多目|标大小过程中触发
  resizeGroup: (e: DragEvent) => void;
  // 调整多目|标大小后触发
  resizeGroupEnd: (e: DragEvent) => void;
  // 点击单目|标触发
  click: (e: DragEvent) => void;
  // 点击多目|标触发
  clickGroup: (e: DragEvent) => void;
  // 设置moveable可拖拽的target
  setMoveableTarget: (argum: IArguments) => void;
  // 设置Top的target
  setTopTarget: (argum: IArguments) => void;
  // 设置Bottom的target
  setBottomTarget: (argum: IArguments) => void;
  // 获取拖拽时的起始坐标，防止位置闪烁
  getStartCoordinate: (argum: IArguments) => void;
  // 拖拽监听
  dragMoveListener: (argum: IArguments) => void;
  // 单组件拖拽
  dragMove: (argum: IArguments) => void;
  // 多组件拖拽
  dragGroupMove: (argum: IArguments) => void;
  // 调整大小
  resizableListener: (argum: IArguments) => void;
  // 调整单组件大小
  updateResize: (argum: IArguments) => void;
  // 调整多组件大小
  updateResizeGroup: (argum: IArguments) => void;
  // 点击拖拽对象
  clickMoveable: (argum: IArguments) => void;
  // 点击拖拽组
  clickMoveableGroup: (argum: IArguments) => void;
  // 设置被选中组件和可被吸附的组件
  // setElementGuidelines: (argum: IArguments) => void;
  // 对拖拽操作进行前置条件校验
  checkMoveTarget: (argum: IArguments) => void;
  // 对调整大小操作进行前置条件校验
  checkResizeTarget: (argum: IArguments) => void;
  // 有组件通过非直接操作更变大小和位置时，更新辅助矩阵
  // updateMoveable: (argum: IArguments) => void;
};

type IPublicAPI = {
  moveableOptions: MoveableOptions; // 组件moveable配置信息
  dragDrop: IDragDrop; // 元件从库拖拽到画布的生命周期，有问题，未实装，建议放到组件属性配置中
  moveable: IMoveable; // 元件在画布中各种事件的生命周期
};
