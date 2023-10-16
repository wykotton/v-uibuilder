import { ISchema } from "./IModelSchema";
export interface IConfigData {
  pageData: {};
  componentsArray: ISchema[];
  exceptionComponents: ISchema[];
  dynamicHTML: string;
  pluginHTML: string;
  version: string;
}

export interface IUndoRedoData {
  componentsArray: ISchema[];
  selectedComponents: string[];
  dynamicHTML: string;
  pluginHTML: string;
}

export interface IRouterPlugin {
  [pluginName: string]: IRouterTarget;
}

export interface IRouterTarget {
  src: string;
  title: string;
  trigger: string[];
  receive: IRouterTargetReceive[];
}

export interface IRouterTargetReceive {
  event: string[];
  script: string;
  target: string;
  page: string;
}
