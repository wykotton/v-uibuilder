import { message } from "ant-design-vue";
import { cloneDeep, throttle } from "lodash-es";
import { ISchema } from "../../../types/runtime/IModelSchema";
import { IReceive, IRouterInfo } from "../../../types/runtime/IRouterConfig";
import { createHashId } from "../../../util/utils";
import { IMessage } from "../../../types/runtime/IMessage";

export enum IStoryType {
  TRIGGER = "trigger",
  RECEIVE = "receive",
}
export enum ModalTypeInfo {
  ADD = "add",
  SEE = "see",
  EDIT = "edit",
  DELETE = "delete",
  COPY = "copy",
}

/**
 * 处理pageList成hash数据
 * @param pageList
 */
export function handleComponentsArray(pageList: Array<any>) {
  const tempPageList: any = {};
  pageList.forEach((item: any) => {
    const tempComponent = {};
    const componentsArray = item?.custom_model?.componentsArray;
    if (componentsArray) {
      componentsArray.forEach((component: ISchema) => {
        tempComponent[component.id] = component;
      });
    }
    tempPageList[item.id] = tempComponent;
  });
  return tempPageList;
}

/**
 * 故事树结构化
 * @param router
 * @param pageList
 * @returns
 */
export function findTargetInfo(
  data: Record<string, Array<IRouterInfo>>,
  pageList: Record<string, any>,
  typeList: string[]
) {
  const tempHashType = {};
  const tree = <any[]>[
    {
      id: createHashId(12, "root-"),
      text: "路由故事线",
      children: <any[]>[],
    },
  ];
  typeList.forEach((type: string, index: number) => {
    const typeTree = {
      id: createHashId(12, "type-"),
      text: type,
      type: type,
      isDrop: true,
      isDelete: true,
      children: <any[]>[],
    };
    tempHashType[type] = index;
    tree[0].children.push(typeTree);
  });
  const trigger = <ISchema[]>[];
  const receive = <ISchema[]>[];
  const triggerIds = <string[]>[];
  const receiveIds = <string[]>[];
  Object.keys(data).forEach((key: string) => {
    data[key].forEach((router: IRouterInfo) => {
      const tempTree = {
        id: router.src,
        srcId: router.src,
        text: router.title,
        routerId: router.id,
        type: router.type,
        isDrag: true,
        children: <any[]>[],
      };
      const element = document.querySelector(`#${router.src}`);
      const model = (element as any)?.componentModel?.model;
      if (model && !triggerIds.includes(model.id)) {
        triggerIds.push(model.id);
        trigger.push(model);
      }
      // const tempTree = getTreeInfo(model, router, true);
      router.receive.forEach((item) => {
        const otherModel = pageList[item.page]?.[item.target];
        if (otherModel && !receiveIds.includes(otherModel.id)) {
          receiveIds.push(otherModel.id);
          receive.push(otherModel);
        }
        // const treeChildren = getTreeInfo(otherModel, item, false);
        // treeChildren ? tempTree.children.push(treeChildren) : void 0;
      });
      tree[0].children[tempHashType[router.type]].children.push(tempTree);
    });
  });
  return { tree, trigger, receive };
}

/**
 * 获取故事树tree数据
 * @param model
 * @param router
 * @param isTrigger
 * @returns
 */
export function getTreeInfo(model: ISchema, router: any, isTrigger: boolean, srcId: string, routerId: string) {
  const tree = {
    id: router.src || router.target,
    srcId,
    routerId,
    type: router.type,
    text: "",
    componentAliasName: "",
    showIcon: true,
    isTrigger: isTrigger,
    event: <string[]>[],
    children: <any[]>[],
  };
  tree.componentAliasName = model?.componentAliasName || "";
  tree.text = model?.iovSchema?.text || "";
  const message = isTrigger
    ? model?.iovSchema?.eventSpecification?.outputMessage
    : model?.iovSchema?.eventSpecification?.inputMessage;
  const events = router.trigger || router.event;
  if (message?.length && events?.length) {
    const tempMessage = {};
    message.forEach((item: Record<string, any>) => {
      tempMessage[item.eventType] = item.text;
    });
    events.forEach((item: string) => {
      if (!item) return;
      tempMessage[item] ? tree.event.push(tempMessage[item]) : tree.event.push(item);
    });
  } else {
    tree.event = events;
  }
  return tree;
}

/**
 * 发起/接收元件的故事树结构化
 * @param router
 * @param pageList
 * @returns
 */
export function findTriggerOrReceiveInfo(
  data: Record<string, Array<IRouterInfo>>,
  pageList: Record<string, any>,
  type: string,
  id: string
) {
  const tree = <any[]>[
    {
      id: createHashId(12, "root-"),
      text: "路由故事线",
      children: <any[]>[],
    },
  ];
  Object.keys(data).forEach((key: string) => {
    const typeTree = {
      id: createHashId(12, "type-"),
      text: key,
      type: key,
      isDrop: true,
      children: <any[]>[],
    };
    data[key].forEach((router: IRouterInfo) => {
      const element = document.querySelector(`#${router.src}`);
      const model = (element as any)?.componentModel?.model;
      const tempTree = getTreeInfo(model, router, true, router.src, router.id);
      if (type === IStoryType.TRIGGER && id === router.src) {
        router.receive.forEach((item) => {
          const otherModel = pageList[item.page]?.[item.target];
          const treeChildren = getTreeInfo(otherModel, item, false, router.src, router.id);
          treeChildren ? tempTree.children.push(treeChildren) : void 0;
        });
        typeTree.children.push(tempTree);
      } else if (type === IStoryType.RECEIVE) {
        router.receive.forEach((item) => {
          if (id === item.target) {
            const otherModel = pageList[item.page]?.[item.target];
            const treeChildren = getTreeInfo(otherModel, item, false, router.src, router.id);
            treeChildren.children.push(tempTree);
            typeTree.children.push(treeChildren);
          }
        });
      }
    });
    typeTree.children.length ? tree[0].children.push(typeTree) : void 0;
  });
  return tree;
}

/**
 * 测试路由消息
 * @param router
 */
export const routerMessageTest = throttle(
  (root: any, router: IRouterInfo) => {
    const { src, trigger, receive } = router;
    let paramErr = false;
    receive.forEach((item: IReceive) => {
      if (!item.page || !item.target || !item.event) paramErr = true;
    });
    if (!src || !trigger.length || paramErr) {
      message.destroy();
      message.warning("请填写完整的路由配置项, 然后进行重试!");
      return;
    }
    const srcTarget: any = document.querySelector(`#${src}`);
    const srcModel = srcTarget?.componentModel.model;
    if (!srcModel) {
      message.destroy();
      message.warning("未找到发起元件model数据!");
      return;
    }
    root.testValue = cloneDeep(router);
    const outMessage = srcModel.iovSchema?.eventSpecification?.outputMessage || [];
    outMessage.forEach((messageInfo: any) => {
      if (trigger.includes(messageInfo.eventType)) {
        const value = messageInfo.messageDemo || "";
        const messageContent: IMessage = {
          header: {
            src,
            srcType: messageInfo.eventType,
            dst: "",
            dstType: "",
          },
          body: value,
        };
        root.componentModel?.sendMessage(messageContent);
        // receive.forEach((item: IReceive) => {
        //   handleReceiveInfo(router, item, messageContent, messageInfo);
        // });
      }
    });
  },
  2000,
  { trailing: false }
);
