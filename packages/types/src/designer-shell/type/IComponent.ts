import { IMessage } from "./IMessage";
import { ISchema } from "./IModelSchema";

/**
 * 总线调用事件与元件发出事件
 */
export interface IEventBusCallBack {
    // 等待总线调用
    onMessage(message: IMessage): void;
    // 元件内|部发出
    sendMessage(message: IMessage): Promise<any>;
}


export interface IComponent extends IEventBusCallBack, HTMLElement {
    // 元件model
    componentModel?: ISchema,
    [key: string]: any;
}


