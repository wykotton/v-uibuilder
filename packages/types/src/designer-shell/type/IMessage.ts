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
        // 路由配置额外参数
        options?: {
            isFirstMessage?: boolean
        }
        // 是否为回流消息
        replyMessage?: boolean;
        // 回流清单
        ids?: {
            srcId: string;
            targetId: string;
            routerId: string;
            receiveId: string;
        };
        reply?: {
            resolve: (messagebody: IMessage) => any,
            reject: (messagebody: IMessage) => any
        },
    },
    body: any
}