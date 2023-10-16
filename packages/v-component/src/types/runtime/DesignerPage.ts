import { IQDepotOptions } from "../../components/q-depot/IQDepot";
import { stringifyDeep } from "../../util/utils";
import { ISchema } from "./IModelSchema";
import JSONfn from "json-fn";

interface IPageEntity {
  shcema: ISchema;
}

class DesignerPage {
  constructor() {
    /* empty */
  }

  componentsArray: ISchema[] = [];
  dynamicHTML = "";
  parse = JSONfn.parse;
  stringify = stringifyDeep;

  getPageEntity(): IPageEntity[] {
    const comList = [...document.querySelectorAll("[data-is-component]")];
    return comList.map((element: any) => {
      return JSON.parse(stringifyDeep(element?.componentModel?.model)) as IPageEntity;
    });
  }

  defineCustomWebcomponent = async (component: IQDepotOptions): Promise<any> => {
    try {
      if (this.isCustomElement(component.componentName)) {
        console.log("组件名已被注册");
        return customElements.get(component.componentName);
      }
      if (component.componentPath instanceof Function) {
        customElements.define(component.componentName, component.componentPath as never);
        return customElements.get(component.componentName);
      }

      // TODO import过不了vite警告
      const asyncComponent = await (new Function(`return import('${component.componentPath}')`)());
      if (!Object.keys(asyncComponent).length) {
        return customElements.get(component.componentName);
      }
      const [componentKey] = Object.keys(asyncComponent);
      customElements.define(component.componentName, asyncComponent[componentKey] as never);
      return customElements.get(component.componentName);
    } catch (error) {
      console.log(error);
    }
  };

  isCustomElement = (name: string) => {
    return customElements.get(name) !== undefined;
  };

  setComponentsPageModel(componentModel: ISchema) {
    this.componentsArray.push(componentModel);
  }

  deleteComponentsPageModel(id: string) {
    this.componentsArray = this.componentsArray.filter((item) => item.id !== id);
  }
}

export default new DesignerPage();
