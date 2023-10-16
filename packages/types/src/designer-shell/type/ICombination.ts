import { ISchema } from "./IModelSchema";
import { IRouterConfig } from "./IRouterConfig";

export interface ICombinationOptions {
  options: ISchema;
  slotName: string;
  children: ICombinationOptions[];
  router?: IRouterConfig;
}
