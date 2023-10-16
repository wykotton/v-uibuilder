import { IEventBus } from "@/types/IEventBus";
import { IMessage } from "@/types/IMessage";
import { IReceive, IRouterConfig, IRouterInfo } from "@/types/IRouterConfig";
import { modelChangeType } from "@zzjz/v-component/src/util/utils";
import { cloneDeep } from "lodash-es";
import { connect } from "socket.io-client";
import {
  EVENTBUS_NAME,
  PARENT_EVENTBUS_NAME,
  SOCKET_ADDRESS,
  SOCKET_BROADCAST_ADDRESS,
  SOCKET_SUBSCRIBE_ADDRESS,
} from "./constent";
import { PagecastEventBusPlugin } from "./PagecastEventBusPlugin";

class CacheMessageHandler {
  private cachedFunctions: Map<string, IMessage[]> = new Map();

  createCachedFunction(eventType: string, message: IMessage): IMessage[] {
    if (!this.cachedFunctions.has(eventType)) {
      this.cachedFunctions.set(eventType, []);
    }
    this.cachedFunctions.get(eventType)?.push(message);
    return this.cachedFunctions.get(eventType) ?? [];
  }

  clearCachedFunction(eventType: string) {
    this.cachedFunctions.set(eventType, []);
  }

  getAllCachedFunctions(eventType: string): IMessage[] {
    return this.cachedFunctions.get(eventType) ?? [];
  }
}

class EventBus implements IEventBus {
  /**
   * 页面广播插件
   */
  pagecastEventBus: PagecastEventBusPlugin;

  /**
   * 所有事件
   */
  eventMap: any = {};

  /**
   * 页面加载完成标识
   */ pageLoaded: boolean = false;
  constructor() {
    this.pagecastEventBus = new PagecastEventBusPlugin((message: any) => {
      this.messageDispatch(message);
    });
  }
  /**
   * pageModel加载完毕通知
   */
  pageLoadedInit() {
    this.pageLoaded = true;
  }

  /**
   * 父页面总线初始化
   */
  parentEventBusInit = () => {
    this.eventMap[PARENT_EVENTBUS_NAME] = (data: any) => {
      console.log(`父页面接收消息数据:`, data);
    };
    const cacheHandler = new CacheMessageHandler();

    this.registerEventHandlers(PARENT_EVENTBUS_NAME, (data: any) => {
      if (!this.pageLoaded) {
        cacheHandler.createCachedFunction(PARENT_EVENTBUS_NAME, data);
        return;
      }
      cacheHandler.getAllCachedFunctions(PARENT_EVENTBUS_NAME)?.forEach((message) => {
        this.eventMap[PARENT_EVENTBUS_NAME](message);
      });
      cacheHandler.clearCachedFunction(PARENT_EVENTBUS_NAME);
      this.eventMap[PARENT_EVENTBUS_NAME](data);
    });
  };

  /**
   * 子页面总线初始化
   */
  eventBusInit = () => {
    this.eventMap[EVENTBUS_NAME] = (data: any) => {
      const { detail } = data;
      const {
        header: { src, replyMessage, ids: { srcId = "" } = { srcId: "" } },
      } = detail;

      const router = Array.from(document.querySelectorAll("q-router-config")).map(
        (current: any) => current.allValue
      ) as IRouterConfig[];

      router.forEach((target: { [key: string]: any } = {}) => {
        const route = replyMessage === true ? target[srcId] : target[src];
        if (!route?.length) return;
        console.log(`事件总线接收消息:`, {
          staticRoute: route,
          data: data?.detail ?? {},
        });
        this.messageDispatch({ staticRoute: route, data: data?.detail ?? {} });
      });
    };
    const cacheHandler = new CacheMessageHandler();

    this.registerEventHandlers(EVENTBUS_NAME, (data: any) => {
      if (!this.pageLoaded) {
        cacheHandler.createCachedFunction(EVENTBUS_NAME, data);
        return;
      }
      cacheHandler.getAllCachedFunctions(EVENTBUS_NAME)?.forEach((message) => {
        this.eventMap[EVENTBUS_NAME](message);
      });
      cacheHandler.clearCachedFunction(EVENTBUS_NAME);
      this.eventMap[EVENTBUS_NAME](data);
    });
  };

  /**
   * 父总线socket初始化
   */
  parentSocketEventBusInit = () => {
    const socket = connect(SOCKET_ADDRESS, { path: `/${SOCKET_SUBSCRIBE_ADDRESS}` });
    socket.on(SOCKET_BROADCAST_ADDRESS, (data) => {
      console.log(data);
    });

    // demo
    setTimeout(() => {
      socket.emit(SOCKET_SUBSCRIBE_ADDRESS, "");
    }, 500);
  };

  /**
   * 事件总线分发
   * @param param0
   * @returns
   */
  messageDispatch = ({ staticRoute = [] as IRouterInfo[], data: iMessage = {} } = {}) => {
    const {
      header: { src, srcType, replyMessage },
    } = iMessage as IMessage;
    if (!src || !srcType) return;
    if (replyMessage) {
      this.replyDispatch({ staticRoute, data: iMessage });
    } else {
      this.basicDispatch({ staticRoute, data: iMessage });
    }
  };
  basicDispatch({ staticRoute = [] as IRouterInfo[], data: iMessage = {} } = {}) {
    const {
      header: { src, srcType, reply, options: { isFirstMessage } = {} },
      body,
    } = iMessage as IMessage;
    staticRoute?.forEach((item: IRouterInfo) => {
      const { id: itemId = "", src: targetSrc, trigger = [], attribute = [], receive = [] } = item;
      // 目|标是否为当前组件,事件是否与触发器匹配
      if (targetSrc === src && trigger.includes(srcType)) {
        // 匹配model变更属性
        if (srcType === modelChangeType) {
          const { path = "" } = body;
          if (attribute.length && path && !attribute.includes(path)) return;
        }
        receive.forEach((cur: IReceive) => {
          const { id: curId = "", target, event: events = [], reply: replyState = false, replyEvents = [] } = cur;
          let { script = "return data" } = cur;
          !script.length ? (script = "function (body, data){return data}") : void 0;
          const dataScript = new Function(`return ${script}`)();
          const conventInfo = dataScript(body, iMessage);
          const dom = document.querySelector(`#${target}`) as any;
          events.forEach((event: string) => {
            try {
              const message = {
                header: {
                  src,
                  srcType,
                  dst: target,
                  dstType: event,
                  fn: dataScript,
                  reply,
                },
                body: cloneDeep(conventInfo),
              };
              console.log(`事件总线分发消息:`, message);
              // dom存在即向dom发送消息不存在即向父页面(默认网关)发送消息
              if (dom && dom?.componentModel) {
                dom.componentModel?.onMessage(message).then((replyValue: any[]) => {
                  if (!replyState) return;
                  const replyMessage = {
                    header: {
                      src: target,
                      srcType: event,
                      dst: src,
                      dstType: "",
                      replyMessage: true,
                      ids: {
                        srcId: src,
                        targetId: target,
                        routerId: itemId,
                        receiveId: curId,
                      },
                    },
                    body: cloneDeep(replyValue),
                  };
                  replyEvents.forEach((replyEvent: string) => {
                    const tempMessage = cloneDeep(replyMessage);
                    tempMessage.header.dstType = replyEvent;
                    console.log(`事件总线进行回流:`, tempMessage);
                    this.sendMessage(tempMessage);
                  });
                });
                return;
              }
              if (isFirstMessage) {
                this.pagecastEventBus.setDefaultGateway(iMessage as IMessage, item);
              }
            } catch (error) {
              console.log(error);
            }
          });
        });
      }
    });
  }
  replyDispatch({ staticRoute = [] as IRouterInfo[], data: iMessage = {} } = {}) {
    const {
      header: {
        src,
        srcType,
        dst,
        dstType,
        reply,
        ids: { srcId = "", targetId = "", routerId = "", receiveId = "" } = {
          srcId: "",
          targetId: "",
          routerId: "",
          receiveId: "",
        },
        options: { isFirstMessage } = {},
      },
      body,
    } = iMessage as IMessage;
    staticRoute?.forEach((item: IRouterInfo) => {
      const { id: itemId = "", src: targetSrc, receive = [] } = item;
      if (targetSrc === srcId && routerId === itemId) {
        receive.forEach((cur: IReceive) => {
          const { id: curId = "", target: receiveTarget } = cur;
          if (receiveTarget === targetId && receiveId === curId) {
            let { replyScript = "return data" } = cur;
            if (!replyScript.length) {
              replyScript = "function (body, data){return data}";
            }
            try {
              const dataScript = new Function(`return ${replyScript}`)();
              const conventInfo = dataScript(body, iMessage);
              const message = {
                header: {
                  src,
                  srcType,
                  dst,
                  dstType,
                  fn: dataScript,
                  reply,
                },
                body: cloneDeep(conventInfo),
              };
              console.log(`事件总线分发回流消息:`, message);
              const dom = document.querySelector(`#${dst}`) as any;
              // dom存在即向dom发送消息不存在即向父页面(默认网关)发送消息
              if (dom && dom?.componentModel) {
                dom.componentModel?.onMessage(message);
                return;
              }
              if (isFirstMessage) {
                this.pagecastEventBus.setDefaultGateway(iMessage as IMessage, item);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
    });
  }

  /**
   * 注册事件
   * @param eventName 事件名称
   * @param callBack
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  registerEventHandlers(eventName: string, callBack: Function): void {
    window.addEventListener(eventName, (event: any) => {
      callBack && callBack(event);
    });
  }

  sendMessage(imessage: IMessage, options = { isFirstMessage: true }) {
    return new Promise((resolve, reject) => {
      const { header } = imessage;
      Object.assign(header, { reply: { resolve, reject }, options });
      const customEvent = new CustomEvent(EVENTBUS_NAME, { detail: imessage });

      window.dispatchEvent(customEvent);
    });
  }

  /**
   * 销毁总线
   */
  destory() {
    for (const item of Object.keys(this.eventMap)) {
      window.removeEventListener(item, this.eventMap[item]);
    }
  }
}

/**
 * 事件销毁
 */
window.addEventListener("beforeunload", function () {
  eventBus.destory();
  eventBus.pagecastEventBus.destory();
});

export const eventBus = new EventBus();
