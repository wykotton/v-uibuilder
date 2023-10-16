import { IMessage } from "./IMessage";

export interface IEventBus {
    eventMap: {
        [key: string]: any
    };
    parentEventBusInit(): void;
    eventBusInit(): void;
    sendMessage(imessage: IMessage): void;
    parentSocketEventBusInit(): void;
    messageDispatch(options: Ioptions): void;
    registerEventHandlers(eventName: string, callBack: Function): void;
    destory(): void;
}

interface Ioptions {
    staticRoute?: any[];
    data?: any;
}





