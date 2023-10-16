declare class ComponentModel {
    constructor(model): {
        [key: string]: any
    }
    model: ISchema;
    el: HTMLElement;
};

// 消息IMessage
export interface IMessage {
    header: {
        // 发起点
        src: string,
        // 发起类型和iovSchema中inputMessage与outputMessage相匹配
        srcType: string,
        // 目|标点
        dst: string,
        // 目|标类型和iovSchema中inputMessage与outputMessage相匹配
        dstType: string,
        // 转换函数
        fn?: (messagebody: IMessage) => any,
        reply?: {
            resolve: (messagebody: IMessage) => any,
            reject: (messagebody: IMessage) => any
        },
    },
    body: any
}

// 结构ISchema
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

    //版本
    //set version(value:string)
    get version(): string;

    [key: string]: any;
}

// 组件IComponent
export interface IComponent {
    model?: ISchema,
    onMessage(message: IMessage): void;
    sendMessage(message: IMessage): Promise<any>;
}

export { ComponentModel };