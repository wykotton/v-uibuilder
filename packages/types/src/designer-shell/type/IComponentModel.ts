import { IEventBusCallBack } from "./IComponent";
import { ISchema } from "./IModelSchema";

export interface IComponentModel extends IEventBusCallBack {
    el?: HTMLElement | any;
    model?: ISchema;
    update: Function[];
    [key: string]: any;
}

export interface IRelationship {
    selectedKey: string;
    src: string;
    target: string;
    bindKey: string;
    handleFn: string;
}
