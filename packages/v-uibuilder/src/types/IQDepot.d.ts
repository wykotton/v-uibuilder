import { ISchema } from "./IModelSchema";



/**
 * 组件仓库协议清单
 */
export interface IQDepotOptions {
    // 组件标签名(zzjz-di-login)
    componentName: string;
    // 组件路径
    componentPath: string | object;
    // 组件名称
    text: string,
    // 组件预览图
    image: string,
    // 组件类型
    type: string,
    // 组件分组列
    group: string[],
    // 组件描述信息
    description: string,
    // 组件model
    options: ISchema,
}

// 元件仓库列表
export interface warehouseInfo {
    name: string;
    url: string;
}

// 示例数据
// const components: IQDepotOptions[] = [
//     { componentName: "q-text", componentPath: "../../../dist/assets/index.js", text: "文本", image: "http://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201601/24/175433rossj7cn74vksn4p.jpg", type: "文本", group: ["UIB原子元件"], description: "这是文本组件,展示文本", options: { iovSchema: {} } as ISchema },
//     { componentName: "q-image", componentPath: "../../../dist/assets/index.js", text: "文本", image: "http://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201601/24/175433rossj7cn74vksn4p.jpg", type: "图片", group: ["UIB原子元件"], description: "这是图片组件,展示图片", options: { iovSchema: {} } as ISchema },
//     { componentName: "q-text", componentPath: "../../../dist/assets/index.js", text: "返回按钮", image: "http://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201601/24/175433rossj7cn74vksn4p.jpg", type: "按钮", group: ["DI业务元件"], description: "这是按钮组件,展示按钮", options: { iovSchema: {} } as ISchema },
//     { componentName: "q-text", componentPath: "../../../dist/assets/index.js", text: "登录", image: "http://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201601/24/175433rossj7cn74vksn4p.jpg", type: "自定义", group: ["DI业务元件"], description: "这是登录组件,展示登录界面", options: { iovSchema: {} } as ISchema }];


