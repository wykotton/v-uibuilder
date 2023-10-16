export type btnType = {
    label: string; // 按钮文字
    type: string; // 按钮风格
    disabled?: boolean; // 按钮可用
    loading?: boolean; // 按钮加载
    func: string; // 点击按钮后触发的父组件事件
}

export interface drawerStyleType {
    drawerWrapperStyle: string;
    contentWrapperStyle: string;
    headerStyle: string;
    bodyStyle: string;
    footerStyle: string;
}
