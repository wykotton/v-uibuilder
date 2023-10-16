import { checkComponentDefined, getComponents } from "@/composition";
import { IBootStrap } from "@/types/IBootStrap";
import { IConfigData } from "@/types/IConfigData";
import { isObject, isString } from "lodash-es";
import { addComponentMask } from "../moveable/mask";
import DesignerPage from "./DesignerPage";
import { eventBus } from "./EventBus";
import { PageModel } from "./PageModel";
import { dragDrop } from "@/utils/dragdrop/index";

class BootStrap implements IBootStrap {
  /**
   * eventsMap
   */
  eventsMap = new Map();
  constructor(options: { root: HTMLElement | string; config: IConfigData; pluginRoot: HTMLElement | string }) {
    const { root, config, pluginRoot } = options;
    this.emit(PageBootStarpEventEnum.PAGE_INIT, options);
    return this.bootStrap(root, config, pluginRoot) as any;
  }

  async bootStrap(root: HTMLElement | string, config: IConfigData, pluginRoot: HTMLElement | string): Promise<any> {
    this.htmlBootStrap(root, config, pluginRoot);
    eventBus.parentEventBusInit();
    eventBus.parentSocketEventBusInit();
    eventBus.eventBusInit();
    const pageModel = this.pageModelBootStrap(config);
    eventBus.pageLoadedInit();
    this.emit(PageBootStarpEventEnum.PAGE_BOOTSTRAP_END, pageModel);
    return pageModel;
  }

  private async htmlBootStrap(root: HTMLElement | string, config: IConfigData, pluginRoot: HTMLElement | string) {
    const { dynamicHTML, pluginHTML } = config;
    const rootDiv = document.createElement("div");
    rootDiv.innerHTML = dynamicHTML;
    const pluginRootDiv = document.createElement("div");
    pluginRootDiv.innerHTML = pluginHTML;
    if (!config) {
      return;
    }
    if (!root || !pluginRoot) {
      throw new Error(`root element or pluginRoot element is null;`);
    }
    if (isString(root)) {
      const target = document.querySelector(root) as HTMLElement;
      if (!target) {
        throw new Error(`root element is null;`);
      }

      Array.from(rootDiv.children).forEach((element) => {
        target.appendChild(element);
      });
    } else {
      Array.from(rootDiv.children).forEach((element) => {
        root.appendChild(element);
      });
    }
    if (isString(pluginRoot)) {
      const target = document.querySelector(pluginRoot) as HTMLElement;
      if (!target) {
        throw new Error(`pluginRoot element is null;`);
      }

      Array.from(pluginRootDiv.children).forEach((element) => {
        target.appendChild(element);
      });
    } else {
      Array.from(pluginRootDiv.children).forEach((element) => {
        pluginRoot.appendChild(element);
      });
    }
  }

  private addMask(pageModelData: IConfigData) {
    if (pageModelData.exceptionComponents?.length) {
      try {
        pageModelData.exceptionComponents.forEach((component) => {
          const componentElement = document.querySelector(`#${component.id}`);
          if (componentElement) {
            addComponentMask(componentElement as HTMLElement);
          }
          DesignerPage.setExceptionComponents(component);
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  private async pageModelBootStrap(config: IConfigData) {
    const pageModelData = config;
    const componentsList = getComponents();
    DesignerPage.initComponentsPageModel();
    for await (const component of pageModelData.componentsArray) {
      if (!component) continue;
      const {
        id,
        iovSchema: { componentName },
      } = component;
      const componentElement = document.getElementById(id) as any;
      // if(componentElement["DragDrop"] !== undefined) componentElement.componentModel.model.DragDrop = dragDrop; // 元件在画布中初始化需要用到
      // dragDrop.dropEventMount(componentElement)
      if (componentElement && componentElement.dropEcho) componentElement.dropEcho(dragDrop);
      const componentDefined = await checkComponentDefined(componentName, componentsList);
      if (!componentDefined) continue;
      try {
        componentElement?.componentModel?.updateModelEntity?.(JSON.stringify(component));
        DesignerPage.setComponentsPageModel(componentElement.componentModel.model);
        componentElement?.componentModel?.model?.lifeCycle?.created?.call?.(
          componentElement,
          componentElement,
          componentElement?.componentModel
        );
        continue;
      } catch (error) {
        console.error(`元件初始化失败:`, error);
      }
      if (componentElement) {
        addComponentMask(componentElement);
      }
      DesignerPage.setExceptionComponents(component);
    }

    this.addMask(pageModelData);
    DesignerPage.dynamicHTML = pageModelData.dynamicHTML;
    DesignerPage.pluginHTML = pageModelData.pluginHTML;
    const pgModel = new PageModel(DesignerPage as any);
    Object.assign(window, { pageModel: pgModel });
    pgModel.pageModelBindBootstrap();
    this.emit(PageBootStarpEventEnum.PAGE_BOOTSTRAP, pgModel);
    return pgModel;
  }

  /**
   * 暴露给外部监听
   * @param event 事件
   * @param listener 监听函数
   */
  private on = (event: PageBootStarpEventType, listener: Function) => {
    if (!isObject(this.eventsMap.get(event))) {
      this.eventsMap.set(event, []);
    }
    this.eventsMap.get(event).push(listener);
  };

  /**
   * 事件发射器
   * @param event 事件类型
   * @param args 参数
   */
  private emit = (event: PageBootStarpEventType, ...args: any[]) => {
    if (isObject(this.eventsMap.get(event))) {
      this.eventsMap.get(event).forEach((listener: Function) => {
        listener.apply(this, args);
      });
    }
  };
}

type PageBootStarpEventType = PageBootStarpEventEnum[keyof PageBootStarpEventEnum];

export enum PageBootStarpEventEnum {
  PAGE_INIT = "PAGE_INIT",
  PAGE_BOOTSTRAP = "PAGE_BOOTSTRAP",
  PAGE_BOOTSTRAP_END = "PAGE_BOOTSTRAP_END",
}

export default BootStrap;
