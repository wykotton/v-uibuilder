import { Components } from "ant-design-vue/lib/date-picker/generatePicker";

export const SIDE_BAR_MINI_WIDTH = 48;
export const SIDE_BAR_SHOW_TIT_MINI_WIDTH = 80;

export enum ContentEnum {
  // auto width
  FULL = "full",
  // fixed width
  FIXED = "fixed",
}

// menu theme enum
export enum ThemeEnum {
  DARK = "dark",
  LIGHT = "light",
}

export enum SettingButtonPositionEnum {
  AUTO = "auto",
  HEADER = "header",
  FIXED = "fixed",
}

export enum SessionTimeoutProcessingEnum {
  ROUTE_JUMP,
  PAGE_COVERAGE,
}

/**
 * 权限模式
 */
export enum PermissionModeEnum {
  // role
  // 角色权限
  ROLE = "ROLE",
  // black
  // 后端
  BACK = "BACK",
  // route mapping
  // 路由映射
  ROUTE_MAPPING = "ROUTE_MAPPING",
}

// Route switching animation
// 路由切换动画
export enum RouterTransitionEnum {
  ZOOM_FADE = "zoom-fade",
  ZOOM_OUT = "zoom-out",
  FADE_SIDE = "fade-slide",
  FADE = "fade",
  FADE_BOTTOM = "fade-bottom",
  FADE_SCALE = "fade-scale",
}

/**
 * 布局常量
 */
export enum PositionEnum {
  ABSOLUTE = "absolute",
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
