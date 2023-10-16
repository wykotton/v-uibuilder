// export type Accordion = boolean;  // 手风琴模式
// export type ActiveKey = string[]|string;  // 当前激活 tab 面板的 key 
// export type Bordered = boolean;  // 带边框风格的折叠面板
// export type Collapsible = "header"|"disabled";  // 所有子面板是否可折叠或指定可折叠触发区域
// export type DestroyInactivePanel = boolean;  // 销毁折叠隐藏的面板
// export type ExpandIcon = string;  // 自定义切换图标
// export type ExpandIconPosition = "left"|"right";  // 设置图标位置：
// export type Ghost = boolean;  // 使折叠面板透明且无边框
// export type Header = string;  // 面板头内容
// export type ShowArrow = boolean;  // 是否展示当前面板上的箭头

export type Appearance = {
    bordered: boolean;  // 带边框风格的折叠面板
    position: "左"|"右";  // 设置图标位置
    ghost: boolean;  // 使折叠面板透明且无边框
}