import { IPageName } from "./public";
import { EditAreaEnum } from "../enum/public";

export declare type IEditConfigArea =
  | EditAreaEnum.LEFT_AREA
  | EditAreaEnum.RIGHT_AREA
  | EditAreaEnum.TOP_AREA
  | EditAreaEnum.BOTTOM_AREA;

export interface IWidgetBaseConfig {
  type: string;
  name: string;
  page: IPageName;
  area: IEditConfigArea;
  props?: Record<string, any>;
  content?: any;
  contentProps?: Record<string, any>;
  [extra: string]: any;
}

export interface IPluginsConfigData {
  edit: IEditConfig;
  // workspace: IWidgetBaseConfig[];
  // setting: IWidgetBaseConfig[];
  // website: IWidgetBaseConfig[];
}

interface IEditConfig {
  leftArea: IWidgetBaseConfig[];
  rightArea: IWidgetBaseConfig[];
  topArea: IWidgetBaseConfig[];
  bottomArea: IWidgetBaseConfig[];
}
