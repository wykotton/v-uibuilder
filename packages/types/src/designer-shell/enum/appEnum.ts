/**
 * 布局常量
 */
export enum PositionEnum {
  ABSOLUTE = "absolute",
  PERCENT = "percent"
}

/**
 * 元件仓库协议
 */
export enum ComponentProtocolEnum {
  REFRESH = "REFRESH",// 元件仓库刷新
  DELETE = "DELETE",// 元件删除
  IMPORT = "IMPORT",// 元件导出
  EXPORT = "EXPORT",// 元件导入
  REGISTER = "REGISTER",// 元件注册
  LOAD = "LOAD",// 元件加载
  AIW = "AIW",
}

/**
 * designer协议
 */
export enum DesignerEnum {
  DESIGNER = "DESIGNER",
}

export enum EInitModelEnum {
  INITBASEMODEL = "initBaseModel",
}

export enum CanvasIdEnum {
  INNER = "inner-dropzone",
  BOTTOM = "bottomcontent",
}

export enum AutoScrollEnum {
  COMPONENT = "component",
  LAYER = "layer",
}

export enum CollapseAndExpandEnum {
  COLLAPSE = "collapse",
  EXPAND = "expand",
}

export enum EditTypeEnum {
  PAGE = "page",
  CHILD_PAGE = "child_page",
}
