export type headType = {
    enable: boolean; // 是否启用
    title: string;  // 标题文字
    icon: string;  // 标题图标
    // fontSize: number;  // 文字大小
    // color: string;  // 文字颜色
    // bgColor: string;  // 背景颜色
    // bgImg: string;  // 背景图片
    // bgImgSize: string;  // 背景图片模式
    headStyle: string;  // 自定义样式
}
export type bodyType = {
    bodyStyle: string;
    // splitLine: {
    //     width: number;
    //     color: string;
    // };
}
export type btnType = {
    label: string; // 按钮文字
    type: string; // 按钮风格
    disabled?: boolean; // 按钮可用
    loading?: boolean; // 按钮加载
    func: string; // 点击按钮后触发的父组件事件
}
export type footType = {
    enable: boolean; // 是否启用
    operation: Array<btnType>;
    footStyle: string;  // 自定义样式
}


export interface modalType {
    head: headType;
    body: bodyType;
    foot: footType;
}
