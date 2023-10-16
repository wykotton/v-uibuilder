import { IComponent, IEventHandlersEventName, IMessage, ISchema } from "@zzjz/v-uibuilder-types";
import { LitElement } from "lit";
import { eventBus } from "./EventBus";

export class Component extends LitElement implements IComponent {

    model: ISchema = {} as ISchema;

    constructor() {
        super();

    }

    /**
     * 总线消息分发
     * @param imessage
     */
    onMessage(imessage: IMessage): void {
        const { header } = imessage;
        const { dstType } = header;
        const nativeEvents = `on${dstType}` as IEventHandlersEventName;
        const DOMEvents = this as never;
        // eslint-disable-next-line @typescript-eslint/ban-types
        const nativeEventsHandler = DOMEvents[nativeEvents] as Function[];
        const customEventsHandler = this.model.onMessageMeta[dstType];

        if (nativeEventsHandler && nativeEventsHandler.length) {
            this.dispatchEvent(imessage.body);
            return;
        }

        customEventsHandler && customEventsHandler.forEach((current) => {
            const fn = current;

            if (fn) {
                const cpFn = new Function("imessage", `return (${fn.toString()}).call(this,imessage)`);
                cpFn.call(this, imessage);
            }
        });
    }

    /**
     * 发送消息
     * @param imessage IMessage
     * @returns
     */
    sendMessage(imessage: IMessage): Promise<any> {
        return eventBus.sendMessage(imessage);
    }
} 