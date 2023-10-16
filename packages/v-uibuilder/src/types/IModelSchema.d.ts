import { IRelationship } from "./IComponentModel";
import { IMessage } from "./IMessage";

export interface ISchema {
    // 组件ID
    get id(): string;
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
    // 组件属性绑定关系
    set attrBindRelationship(value: IRelationship | IRelationship[]);
    get attrBindRelationship(): IRelationship[];
    [key: string]: any,
}

type ILifeCycle = { created: (model: ISchema) => void, updated: (model: ISchema) => void, destroy: () => void };
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
    TEXT = '文本',
    FROM = '表单',
    MEDIA = '媒体',
    CONTAINER = '容器',
    CHART = '图元',
    DATASOURCE = '数据源',
    PLUGIN = '插件',
    CUSTOM = '自定义',
}

/**
 * 元件分组
 */
export enum EComponentGroup {
    BASIC = 'UIB原子元件',
    CHART = '图表元件',
    DIBUSINESS = 'DI业务元件',
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
    eventSpecification: {
        // 输入事件
        inputMessage: IEventSpecificationEvent[],
        // 输出事件
        outputMessage: IEventSpecificationEvent[]
    }
    optionsView: {
        // 输入选项
        list: IOptionsView[],
    }
}

export interface IOptionsView {
    // 类型
    type: string,
    // 名称
    label: string,
    // 参数项
    options: {
        type: string,
        width: string,
        defaultValue: string,
        placeholder: string,
        clearable: boolean,
        maxLength: number,
        prepend: string,
        append: string,
        tooptip: string,
        hidden: boolean,
        disabled: boolean,
        dynamicHide: boolean,
        dynamicHideValue: string,
    },
    model: string,
    key: string,
    rules: IOptionsViewRules[],
}

export interface IOptionsViewRules {
    required: boolean,
    message: string,
    trigger: string[]
}

export interface IEventSpecificationEvent {
    text: string,
    eventType: string,
    messageSchema: string,
    messageDemo: string,
}
