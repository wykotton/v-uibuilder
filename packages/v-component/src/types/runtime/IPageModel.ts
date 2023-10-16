import { IComponent } from "./IComponent";
import { IConfigData } from "./IConfigData";

export interface IPageModel {
    pageModel: IConfigData;
    get(id: string): any;
    delete(id: string): boolean;
    add(component: IComponent): void;
    update(component: IComponent): boolean;
}