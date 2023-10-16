import { ISchema } from "./IModelSchema";

export interface IConfigData {
    pageData: {},
    componentsArray: ISchema[],
    dynamicHTML: string,
    pluginHTML: string,
    exceptionComponents: ISchema[],
} 