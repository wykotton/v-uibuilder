export interface IMessage {
  header: {
    // 发起点
    src: string;
    // 发起类型和iovSchema中inputMessage与outputMessage相匹配
    srcType: string;
    // 目|标点
    dst: string;
    // 目|标类型和iovSchema中inputMessage与outputMessage相匹配
    dstType: string;
    // 转换函数
    fn?: (messagebody: IMessage) => any;
    reply?: {
      resolve: (messagebody: IMessage) => any;
      reject: (messagebody: IMessage) => any;
    };
    // 是否进行回流
    replyMessage?: boolean;
    // 路由id信息
    ids?: {
      srcId: string;
      targetId: string;
      routerId: string;
      receiveId: string;
    };
    // 跨页面消息配置
    options?: {
      // 是否属于广播第一次发送
      isFirstMessage?: boolean;
      router?: any;
    };
  };
  body: any;
}
