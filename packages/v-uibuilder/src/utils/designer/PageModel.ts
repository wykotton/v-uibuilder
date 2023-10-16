import {
  changePluginSource,
  checkComponentDefined,
  getBreadcrumb,
  getComponents,
  useResetTree,
} from "@/composition/index";
import { IConfigData } from "@/types/IConfigData";
import { ISchema } from "@/types/IModelSchema";
import { IPageModel } from "@/types/IPageModel";
import { IAttributeConfig, IAttributeInfo } from "@/types/IRouterConfig";
import { message } from "ant-design-vue";
import { removeComponentMask } from "../moveable/mask";
import { globalComponent } from "./GlobalComponent";
import { handleAttributeBind } from "@zzjz/v-component/src/util/attr-bind";

export class PageModel implements IPageModel {
  /**
   * 页面模型
   */
  pageModel: IConfigData;
  /**
   * 版本号
   */
  version = "1.0.0";
  private _selectedComponents: ISchema[] = [];

  constructor(pageModel: IConfigData) {
    this.pageModel = pageModel;
  }

  get selectedComponents() {
    return this._selectedComponents;
  }

  get currentComponent() {
    return this._selectedComponents[0];
  }

  get globalComponents() {
    return globalComponent;
  }

  get(id: string) {
    const component = this.pageModel.componentsArray.find((component: any) => component?.id === id) || {};
    const dom = document.getElementById(id);
    if (!Object.keys(component).length) {
      Object.assign(component, { dom });
      return false;
    }
    return component;
  }

  delete(id: string) {
    const index = this.pageModel.componentsArray.findIndex((component: any) => component?.id === id);
    document.getElementById(id)?.remove();
    if (index > -1) {
      this.pageModel.componentsArray.splice(index, 1);
      return true;
    }
    return false;
  }

  add(component: ISchema) {
    if (!component) return;
    const index = this.pageModel.componentsArray.findIndex((item) => item.id === component.id);
    if (index !== -1) {
      this.pageModel.componentsArray[index] = component;
    } else {
      this.pageModel.componentsArray.push(component);
    }
  }

  update(component: ISchema) {
    const index = this.pageModel.componentsArray.findIndex((current: any) => current?.id === component?.id);
    if (index > -1) {
      Object.assign(this.pageModel.componentsArray[index], component);
      return true;
    }
    return false;
  }

  clear() {
    this.pageModel.componentsArray = [];
  }

  /**
   * 添加选中数据
   * @param ids
   * @returns
   */
  public async addSelected(ids: string[]) {
    if (!ids || !ids.length) {
      message.error("添加选中组件数据操作有误！");
      return;
    }
    for await (const id of ids) {
      const index = this.selectedComponents.findIndex((item) => item.id === id);
      if (index !== -1) return;
      const component = this.get(id);
      if (component) {
        this._selectedComponents.push(component as unknown as ISchema);
      } else {
        await this.checkException(id);
      }
    }
    // 更新插件元件配置源
    changePluginSource();
    // 获取所选组件面包屑
    getBreadcrumb();
  }

  /**
   * 移除选中数据
   * @param ids
   * @returns
   */
  public removeSelected(ids: string[]) {
    if (!ids || !ids.length) {
      message.error("移除选中组件数据操作有误！");
      return;
    }
    ids.forEach((id) => {
      const index = this.selectedComponents.findIndex((item) => item.id === id);
      if (index === -1) return;
      this._selectedComponents.splice(index, 1);
    });
  }

  /**
   * 清除所有选中数据
   */
  public clearSelected() {
    this._selectedComponents = [];
    // 更新组件面包屑
    getBreadcrumb();
  }

  /**
   * 清除所有异常数据
   */
  public clearExceptionComponents() {
    this.pageModel.exceptionComponents = [];
  }

  /**
   * 检查异常元件
   * @param id
   */
  public async checkException(id: string) {
    const element: any = document.querySelector(`#${id}`);
    if (!element) {
      message.destroy();
      message.error("未查找到元件实例！");
      return;
    }
    if (element.componentModel) {
      // 元件已被正常渲染，进行数据恢复
      this.handleException(element);
      return;
    }
    const componentsList = getComponents();
    const componentName = element.tagName.toLocaleLowerCase();
    const componentDefined = await checkComponentDefined(componentName, componentsList);
    if (componentDefined) {
      this.handleException(element);
    } else {
      message.destroy();
      message.error("元件数据查找失败,请检查元件仓库！");
    }
  }

  /**
   * 恢复异常元件
   * @param element
   * @returns
   */
  public handleException(element: any) {
    if (!element?.componentModel) return;
    const index = this.pageModel.exceptionComponents.findIndex((item) => item.id === element.id);
    if (index !== -1) {
      try {
        const exceptionModel = this.pageModel.exceptionComponents[index];
        element.componentModel.updateModelEntity(JSON.stringify(exceptionModel));
      } catch (error) {}
      this.pageModel.exceptionComponents.splice(index, 1);
    }
    this.add(element.componentModel.model);
    removeComponentMask(element);
    this._selectedComponents.push(element.componentModel.model);
    useResetTree(true, false, false, true);
  }

  /**
   * 检查当前id是否被选中
   * @param id
   * @returns
   */
  public checkFocus(id: string) {
    if (!id) return false;
    const index = this.selectedComponents.findIndex((item) => item.id === id);
    if (index !== -1) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 页面数据模型绑定关系启动
   */
  pageModelBindBootstrap() {
    const allBind = Array.from(document.querySelectorAll("q-attribute-bind")).map(
      (element: any) => element.value || {}
    );
    allBind.forEach((config: IAttributeConfig) => {
      Object.keys(config).forEach((key: string) => {
        config[key]?.forEach((info: IAttributeInfo) => {
          handleAttributeBind(info);
        });
      });
    });
  }
}
