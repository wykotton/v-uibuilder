// import { ComponentProtocolEnum, IBootStrap, IConfigData, ISchema } from "@zzjz/v-uibuilder-types";
// import { isString } from "lodash-es";
// import { componentsAction, getComponents } from "../../depot-protocol/depot";
// import { addComponentMask } from "../widgets/mask/mask";
// import DesignerPage from "./DesignerPage";
// import { eventBus } from "./EventBus";
// import { PageModel } from "./PageModel"; 

// class BootStrap implements IBootStrap {
//   constructor(options: { root: HTMLElement | string; config: IConfigData; pluginRoot: HTMLElement | string }) {
//     const { root, config, pluginRoot } = options;
//     return this.bootStrap(root, config, pluginRoot) as any;
//   }

//   async bootStrap(root: HTMLElement | string, config: IConfigData, pluginRoot: HTMLElement | string): Promise<any> {
//     this.htmlBootStrap(root, config, pluginRoot);
//     eventBus.parentEventBusInit();
//     eventBus.parentSocketEventBusInit();
//     eventBus.eventBusInit();
//     return this.pageModelBootStrap(config);
//   }

//   private async htmlBootStrap(root: HTMLElement | string, config: IConfigData, pluginRoot: HTMLElement | string) {
//     const { dynamicHTML, pluginHTML } = config;
//     const rootDiv = document.createElement("div");
//     rootDiv.innerHTML = dynamicHTML;
//     const pluginRootDiv = document.createElement("div");
//     pluginRootDiv.innerHTML = pluginHTML;
//     if (!config) {
//       return;
//     }
//     if (!root || !pluginRoot) {
//       throw new Error(`root element or pluginRoot element is null;`);
//     }
//     if (isString(root)) {
//       const target = document.querySelector(root) as HTMLElement;
//       if (!target) {
//         throw new Error(`root element is null;`);
//       }

//       Array.from(rootDiv.children).forEach((element) => {
//         target.appendChild(element);
//       });
//     } else {
//       Array.from(rootDiv.children).forEach((element) => {
//         root.appendChild(element);
//       });
//     }
//     if (isString(pluginRoot)) {
//       const target = document.querySelector(pluginRoot) as HTMLElement;
//       if (!target) {
//         throw new Error(`pluginRoot element is null;`);
//       }

//       Array.from(pluginRootDiv.children).forEach((element) => {
//         target.appendChild(element);
//       });
//     } else {
//       Array.from(pluginRootDiv.children).forEach((element) => {
//         pluginRoot.appendChild(element);
//       });
//     }
//   }

//   private addMask(pageModelData: IConfigData) {
//     if (pageModelData.exceptionComponents?.length) {
//       try {
//         pageModelData.exceptionComponents.forEach((component) => {
//           const componentElement = document.querySelector(`#${component.id}`);
//           if (componentElement) {
//             addComponentMask(componentElement as HTMLElement);
//           }
//           DesignerPage.setExceptionComponents(component);
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   }

//   private async pageModelBootStrap(config: IConfigData) {
//     const pageModelData = config;
//     const componentsList = getComponents();
//     DesignerPage.initComponentsPageModel();
//     for await (const component of pageModelData.componentsArray) {
//       if (!component) continue;
//       const {
//         id,
//         iovSchema: { componentName },
//       } = component;
//       const target = componentsList.find((current: ISchema) => current.componentName === componentName);
//       const componentElement = document.getElementById(id) as any;
//       if (target) { 
//         componentsAction("uib", {
//           type: ComponentProtocolEnum.REGISTER,
//           body: {
//             fn: DesignerPage.defineCustomWebcomponent,
//             fnData: target,
//           },
//         });
//       } else {
//         console.error(`${componentName}元件仓库内未找到该元件!:`, componentName);
//       }
//       try {
//         await DesignerPage.whenDefinedComponent(componentName);
//       } catch (error) {
//         console.error(`${componentName}元件未找到或元件未定义!:`, error);
//         continue;
//       }
//       try {
//         componentElement?.componentModel?.updateModelEntity?.(JSON.stringify(component));
//         DesignerPage.setComponentsPageModel(componentElement.componentModel.model);
//         componentElement?.componentModel?.model?.lifeCycle?.created?.();
//         continue;
//       } catch (error) {
//         console.error(`元件初始化失败:`, error);
//       }
//       if (componentElement) {
//         addComponentMask(componentElement);
//       }
//       DesignerPage.setExceptionComponents(component);
//     }

//     this.addMask(pageModelData);
//     DesignerPage.dynamicHTML = pageModelData.dynamicHTML;
//     DesignerPage.pluginHTML = pageModelData.pluginHTML;
//     const pgModel = new PageModel(DesignerPage as any);
//     Object.assign(window, { pageModel: pgModel });
//     pgModel.pageModelBindBootstrap();
//     return pgModel;
//   }
// }

// export default BootStrap;
