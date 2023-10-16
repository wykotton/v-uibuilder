import { ISchema } from "./IModelSchema";
import { IAttributeConfig } from "./IRouterConfig";

export interface ICombinationOptions {
  options: ISchema;
  slotName: string;
  children: ICombinationOptions[];
  router?: IRouterConfig;
  attr_bind?: IAttributeConfig;
}
