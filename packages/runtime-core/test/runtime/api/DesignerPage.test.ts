// import { stringifyDeep } from "../../util/utils.test";
// import { ISchema, IQDepotOptions } from "@zzjz/v-uibuilder-types";
// import JSONfn from "json-fn";

// interface IPageEntity {
//   schema: ISchema;
// }

// class DesignerPage {
//   constructor() {
//     /* empty */
//   }

//   componentsArray: ISchema[] = [];
//   exceptionComponents: ISchema[] = [];
//   dynamicHTML = ``;
//   pluginHTML = ``;
//   parse = JSONfn.parse;
//   stringify = stringifyDeep;

//   getPageEntity(): IPageEntity[] {
//     const comList = Array.from(document.querySelectorAll("[data-is-component]"));
//     return comList.map((element: any) => {
//       return JSON.parse(stringifyDeep(element?.componentModel?.model)) as IPageEntity;
//     });
//   }

//   defineCustomWebcomponent = async (component: IQDepotOptions): Promise<any> => {
//     try {
//       if (this.isCustomElement(component.componentName)) {
//         console.log(`组件名已被注册`);
//         return customElements.get(component.componentName);
//       }
//       if (component.componentPath instanceof Function) {
//         customElements.define(component.componentName, component.componentPath as never);
//         return customElements.get(component.componentName);
//       }
//       if (!component.componentPath) return;
//       // TODO import过不了vite警告
//       const asyncComponent = await (new Function(`return import('${component.componentPath}')`)());
//       if (this.isCustomElement(component.componentName)) {
//         // js执行自动注册
//         console.log(`组件已被注册`);
//         return customElements.get(component.componentName);
//       }
//       if (!Object.keys(asyncComponent).length) {
//         return customElements.get(component.componentName);
//       }
//       const [componentKey] = Object.keys(asyncComponent);
//       customElements.define(component.componentName, asyncComponent[componentKey] as never);
//       return customElements.get(component.componentName);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   /**
//    * 查看元件是否注册
//    * @param componentName 元件名称
//    * @param timeout 超时
//    * @returns
//    */
//   whenDefinedComponent(componentName: string, timeout = 3000) {
//     return Promise.race([
//       customElements.whenDefined(componentName),
//       new Promise((_resolve, reject) => {
//         setTimeout(() => {
//           reject();
//         }, timeout);
//       }),
//     ]);
//   }

//   isCustomElement = (name: string) => {
//     return customElements.get(name) !== undefined;
//   };

//   initComponentsPageModel() {
//     this.componentsArray = [];
//   }

//   setComponentsPageModel(componentModel: ISchema) {
//     this.componentsArray.push(componentModel);
//   }

//   deleteComponentsPageModel(id: string) {
//     this.componentsArray = this.componentsArray.filter((item) => item.id !== id);
//   }

//   setExceptionComponents(componentModel: ISchema) {
//     this.exceptionComponents.push(componentModel);
//   }

//   deleteExceptionComponents(id: string) {
//     const index = this.exceptionComponents.findIndex((item) => item.id === id);
//     if (index !== -1) {
//       this.exceptionComponents.splice(index, 1);
//     }
//   }
// }

// export default new DesignerPage();
