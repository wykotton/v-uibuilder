// import { IMessage, IRouterInfo } from "@zzjz/v-uibuilder-types";
// import { BroadcastChannel } from "broadcast-channel";
// import { MSG_KEY, PAGE_EVENTBUS_NAME } from "../../const";
// import DesignerPage from "../../api/DesignerPage";

// /**
//  * EventBus页面广播插件
//  */
// export class PagecastEventBusPlugin {
//   /**
//    * 广播扩展
//    */
//   #channel = new BroadcastChannel(PAGE_EVENTBUS_NAME);

//   /**
//    * 回调
//    */
//   pagecastCallBack: Function;

//   constructor(callBack: Function) {
//     this.pagecastCallBack = callBack;
//     this.pagecastInit();
//   }

//   /**
//    * 父总线socket初始化
//    */
//   pagecastInit = () => {
//     this.#channel.addEventListener(MSG_KEY, this.pagecastHandeler);
//   };

//   /**
//    * 订阅广播逻辑
//    */
//   pagecastHandeler = (data: IMessage) => {
//     console.log(data, `广播数据`);
//     const parseData = DesignerPage.parse(data);
//     try {
//       const {
//         header: {
//           options: { router },
//         },
//       } = parseData;
//       if (router) {
//         Reflect.set(parseData.header, "options", { isFirstMessage: false });
//         this.pagecastCallBack({ staticRoute: router, data: parseData });
//       }
//     } catch (error) {
//       console.info(`非跨页面广播数据:`, error);
//     }
//   };

//   /**
//    * 事件往父页面总线分发
//    * @param param0
//    * @returns
//    */
//   setDefaultGateway = (iMessage: IMessage, router: IRouterInfo) => {
//     Reflect.set(iMessage.header, "reply", {});
//     Reflect.set(iMessage.header, "options", { router });

//     this.#channel.postMessage(DesignerPage.stringify(iMessage));
//   };

//   /**
//    * 注销广播插件
//    */
//   destory() {
//     this.#channel.removeEventListener(MSG_KEY, this.pagecastHandeler);
//     return this.#channel.close();
//   }
// }
