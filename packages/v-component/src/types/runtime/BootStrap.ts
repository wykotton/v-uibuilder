import { cloneDeep, isString } from "lodash-es";
import { awaitTime, stringifyDeep } from "../../util/utils";
import DesignerPage from "./DesignerPage";
import { eventBus } from "./EventBus";
import { IBootStrap } from "./IBootStrap";
import { IConfigData } from "./IConfigData";
import { PageModel } from "./PageModel";

declare global {
  let pageModel: any;
}

class BootStrap implements IBootStrap {
  constructor(root: HTMLElement | string, config: IConfigData) {
    this.bootStrap(root, config);
  }

  bootStrap(root: HTMLElement | string, config: IConfigData): any {
    this.htmlBootStrap(root, config);
    eventBus.eventBusInit();
    return this.pageModelBootStrap(config);
  }

  private async htmlBootStrap(root: HTMLElement | string, config: IConfigData) {
    const { dynamicHTML } = config;
    const div = document.createElement("div");
    div.innerHTML = dynamicHTML;
    if (!config) {
      return;
    }
    if (!root) {
      throw new Error("root element is null;");
    } else if (isString(root)) {
      const target = document.querySelector(root) as HTMLElement;
      if (!target) {
        throw new Error("root element is null;");
      }

      Array.from(div.children).forEach((element) => {
        target.appendChild(element);
      });
      return await this.pageModelBootStrap(cloneDeep(config));
    }

    Array.from(div.children).forEach((element) => {
      root.appendChild(element);
    });
  }

  private async pageModelBootStrap(config: IConfigData) {
    const pageModelData = new Proxy(config, {}) as unknown as IConfigData;

    pageModelData.componentsArray.forEach((component: any) => { });
    for await (const component of pageModelData.componentsArray) {
      const { id } = component;
      const componentElement = document.getElementById(id) as any;
      while (!componentElement.componentModel) {
        await awaitTime(50);
      }
      if (componentElement?.componentModel) {
        componentElement.componentModel.updateModelEntity(stringifyDeep(component));
        DesignerPage.setComponentsPageModel(componentElement.componentModel.model);
      }
    }

    Object.assign(window, { pageModel: new PageModel(pageModelData) });

    return pageModel;
  }
}

export default BootStrap;
