import { html } from "lit";
export default [
  { 
    label: "模态",
    value: "dialog",
    icon: "",
    list: [
      { 
        icon: "question", 
        label: "初始化", 
        value: "init", 
        text: `const Dialog = new pageModel.globalComponents.Dialog({
  title: '模态标题',
  bodyHtml: "<div>模态内容区</div>"
})`, 
        range: [0, 6, 0, 12], 
        help: html`# 初始化模态
const Dialog = new pageModel.globalComponents.Dialog(Option)

# Option介绍 （参数配置和元件属性面板配置一致）
Option {
container?: Element|string; // 初始化模态节点
size?: string; // 模态快捷尺寸 可选值: 大|中|小|自定义
mWidth?: string; // 宽度，size为自定义时有效
mHeight?: number; // 高度，size为自定义时有效
mask?: boolean; // 是否显示遮罩
maskClosable?: boolean; // 是否点击遮罩关闭
dialogStyle?: string; // 外层样式, 如："background-color: #ffffff;", 其他配置样式均采用该格式
closeData?: {
    enable: boolean; // 是否启用右上角关闭按钮
    icon: string; // 关闭按钮自定义图标
}; // 关闭配置
title?: string; // 模态标题
icon?: string; // 模态标题前图标
onload?: Function; // 加载完成执行函数
handleOk?: Function; // 默认点击确定执行函数，配置operation后会被覆盖
handleClose?: Function; // 默认点击取消执行函数
afterClose?: Function; // 关闭模态后执行函数
operation?: {
  label: string; // 按钮文字
  type?: string; // 按钮风格 可选值: primary|dashed|text|link  { "默认": "", "主要": "primary", "虚边": "dashed", "文字": "text", "链接": "link" }
  disabled?: boolean; // 按钮可用
  loading?: boolean; // 按钮加载
  func: string; // 点击按钮后触发的父组件事件
}; // 操作按钮配置
styleData?: {
  head: {
    enable: boolean; // 是否启用
    headStyle: string;  // 自定义样式
  };
  body: {
    bodyStyle: string;
  };
  foot: {
    enable: boolean; // 是否启用
    footStyle: string;  // 自定义样式
  };
}; // 
mode?: string; // 内容模式 可选值 ""|"child-page" 默认为html
bodyHtml: Element|string; // 当配置mode为child-page时，此值为子页面ID，其他时候可为Element或Html字符串(也可以嵌入iframe)
}

# 完整示例
const Dialog = new pageModel.globalComponents.Dialog({
title: '模态标题',
icon: '<svg focusable="false" class="" data-icon="build" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M916 210H376c-17.7 0-32 14.3-32 32v236H108c-17.7 0-32 14.3-32 32v272c0 17.7 14.3 32 32 32h540c17.7 0 32-14.3 32-32V546h236c17.7 0 32-14.3 32-32V242c0-17.7-14.3-32-32-32zm-504 68h200v200H412V278zm-68 468H144V546h200v200zm268 0H412V546h200v200zm268-268H680V278h200v200z"></path></svg>',
size: '自定义',
mWidth: '50%',
mHeight: 300,
mask: true,
maskClosable: true,
dialogStyle: 'background-color: #ffffff;',
closeData: {
  enable: true,
  icon: '<svg focusable="false" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>'
},
onload: () => {},
handleOk: () => {},
handleClose: () => {},
afterClose: () => {},
operation: [{
  label: '确定',
  type: 'primary',
  disabled: false,
  loading: false,
  func: () => {
    pageModel.globalComponents.message.success('确定!')
    Dialog.close()
  }
}, {
  label: '取消',
  func: () => {
    pageModel.globalComponents.message.info('取消!')
    Dialog.close()
  }
}],
styleData: {
  head: {
    enable: true,
    headStyle: 'background-color: #ffffff;'
  },
  body: {
    bodyStyle: 'background-color: #ffffff;'
  },
  foot: {
    enable: true,
    footStyle: 'background-color: #ffffff;'
  },
},
mode: 'child-page',
bodyHtml: '7377gw63l0t2'
})
        `
      },
      { icon: "", label: "打开", value: "open", text: 'Dialog.open()', range: [0, 0, 0, 6] },
      { icon: "", label: "关闭", value: "close", text: 'Dialog.close()', range: [0, 0, 0, 6] },
      { icon: "", label: "关闭全部", value: "closeAll", text: 'Dialog.closeAll()', range: [0, 0, 0, 6] },
      { icon: "", label: "销毁", value: "destory", text: 'Dialog.destory()', range: [0, 0, 0, 6] },
      { icon: "", label: "销毁全部", value: "destoryAll", text: 'Dialog.destoryAll()', range: [0, 0, 0, 6] }
    ]
  },
  { 
    label: "抽屉",
    value: "drawer",
    icon: "",
    list: [
      { 
        icon: "question", 
        label: "初始化", 
        value: "init", 
        text: `const Drawer = new pageModel.globalComponents.Drawer({
  title: '抽屉标题',
  bodyHtml: "<div>抽屉内容区</div>"
})`, 
        range: [0, 6, 0, 12], 
        help: html`# 初始化抽屉
const Drawer = new pageModel.globalComponents.Drawer(Option)

# Option介绍 （参数配置和元件属性面板配置一致）
Option {
container?: Element|string; // 初始化抽屉节点
placement?: string; // 抽屉弹出方向, 默认值: right, 可选值: top|right|bottom|left
size?: string; // 抽屉快捷尺寸, 默认值: 小, 可选值: 大|中|小|自定义
mWidth?: string; // 宽度, 默认值: '378', size为自定义时有效
mHeight?: number; // 内容高度, 默认值: 920, size为自定义时有效
mask?: boolean; // 是否显示遮罩
maskClosable?: boolean; // 是否点击遮罩关闭
closeData?: {
    enable: boolean; // 是否启用右上角关闭按钮
    icon: string; // 关闭按钮自定义图标
}; // 关闭配置
headEnable: boolean; // 是否启用头部
footEnable: boolean; // 是否启用底部
title?: string; // 抽屉标题
icon?: string; // 抽屉标题前图标
onload?: Function; // 加载完成执行函数
handleOk?: Function; // 默认点击确定执行函数, 配置operation后会被覆盖
handleClose?: Function; // 默认点击取消执行函数
afterVisibleChange?: Function; // 关闭模态后执行函数
operation?: {
  label: string; // 按钮文字
  type?: string; // 按钮风格 可选值: primary|dashed|text|link  { "默认": "", "主要": "primary", "虚边": "dashed", "文字": "text", "链接": "link" }
  disabled?: boolean; // 按钮可用
  loading?: boolean; // 按钮加载
  func: string; // 点击按钮后触发的父组件事件
}; // 操作按钮配置
drawerStyle: {
  drawerWrapperStyle: string; // 外层样式, 如："background-color: #ffffff;", 其他配置样式均采用该格式
  contentWrapperStyle: string; // 包裹内容部分样式
  headerStyle: string; // 头部样式
  bodyStyle: string; // 内容部分样式
  footerStyle: string; // 底部样式
}; // 抽屉各部分样式
mode?: string; // 内容模式 可选值 ""|"child-page" 默认为html
bodyHtml: Element|string; // 当配置mode为child-page时, 此值为子页面ID, 其他时候可为Element或Html字符串(也可以嵌入iframe)
}

# 完整示例
const Drawer = new pageModel.globalComponents.Drawer({
title: '抽屉标题',
icon: '<svg focusable="false" class="" data-icon="build" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M916 210H376c-17.7 0-32 14.3-32 32v236H108c-17.7 0-32 14.3-32 32v272c0 17.7 14.3 32 32 32h540c17.7 0 32-14.3 32-32V546h236c17.7 0 32-14.3 32-32V242c0-17.7-14.3-32-32-32zm-504 68h200v200H412V278zm-68 468H144V546h200v200zm268 0H412V546h200v200zm268-268H680V278h200v200z"></path></svg>',
placement: 'right',
size: '自定义',
mWidth: '50%',
mHeight: 300,
mask: true,
maskClosable: true,
headEnable: true,
footEnable: true,
closeData: {
  enable: true,
  icon: '<svg focusable="false" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>'
},
drawerStyle: {
  drawerWrapperStyle: "background-color: #ffffff;",
  contentWrapperStyle: "",
  headerStyle: "",
  bodyStyle: "",
  footerStyle: ""
},
operation: [{
  label: '确定',
  type: 'primary',
  disabled: false,
  loading: false,
  func: () => {
    pageModel.globalComponents.message.success('确定!')
    Drawer.close()
  }
}, {
  label: '取消',
  func: () => {
    pageModel.globalComponents.message.info('取消!')
    Drawer.close()
  }
}],
onload: () => {},
handleOk: () => {},
handleClose: () => {},
afterVisibleChange: () => {},
mode: 'child-page',
bodyHtml: '7377gw63l0t2'
})
        `
      },
      { icon: "", label: "打开", value: "open", text: 'Drawer.open()', range: [0, 0, 0, 6] },
      { icon: "", label: "关闭", value: "close", text: 'Drawer.close()', range: [0, 0, 0, 6] },
      { icon: "", label: "关闭全部", value: "closeAll", text: 'Drawer.closeAll()', range: [0, 0, 0, 6] },
      { icon: "", label: "销毁", value: "destory", text: 'Drawer.destory()', range: [0, 0, 0, 6] },
      { icon: "", label: "销毁全部", value: "destoryAll", text: 'Drawer.destoryAll()', range: [0, 0, 0, 6] }
    ]
  }
]