import { IComponent } from "./IComponent";
import { IConfigData } from "./IConfigData";
import { ISchema } from "./IModelSchema";

export interface IPageModel {
    pageModel: IConfigData;
    selectedComponents: ISchema[];
    globalComponents: any;
    version: string;
    get(id: string): any;
    delete(id: string): boolean;
    add(component: ISchema): void;
    update(component: ISchema): boolean;
}

export interface IDesignerConfig {
    app_all_pel_path: string;
    app_cavans_color: string;
    app_pic_path: string;
    app_publish_ip: string;
    app_publish_path: string;
    app_theme_color: string;
    component_warehouse: IComponentWarehouse[];
    is_grid: boolean;
    used: number;
    version: string;
    website_name: string;
}

export interface IComponentWarehouse {
    name: string;
    url: string;
}