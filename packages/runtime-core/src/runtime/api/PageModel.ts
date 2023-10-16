import { IConfigData, IPageModel, ISchema } from "@zzjz/v-uibuilder-types";
import { message } from "ant-design-vue";
import { isArray } from "lodash-es";
import { getParentAttribute, proxySetFN, rewritePropertyDescriptor } from "../../designer";
import { globalComponent } from "./GlobalComponent";

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
    this.pageModel.componentsArray.push(component);
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
  public addSelected(ids: string[]) {
    if (!ids || !ids.length) {
      message.error("添加选中组件数据操作有误！");
      return;
    }
    ids.forEach((id) => {
      const index = this.selectedComponents.findIndex((item) => item.id === id);
      if (index !== -1) return;
      const component = this.get(id);
      if (component) {
        this._selectedComponents.push(component as unknown as ISchema);
      } else {
        message.error("选中组件数据查找失败,请检查数据！");
      }
    });
    // 更新路由配置源
    // changeRouterSource();
    // 获取所选组件面包屑
    // getBreadcrumb();
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
    // getBreadcrumb();
  }

  /**
   * 清除所有异常数据
   */
  public clearExceptionComponents() {
    this.pageModel.exceptionComponents = [];
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
    this.pageModel.componentsArray.forEach((component: ISchema) => {
      if (component && component?.attrBindRelationship && isArray(component.attrBindRelationship)) {
        component.attrBindRelationship.forEach((attr: any) => {
          const { src, target, bindKey } = attr;
          const targetComponent = this.pageModel.componentsArray.find((current: any) => current.id === target);
          if (!targetComponent) return;
          const { currentAttr, currentKey } = getParentAttribute(targetComponent, bindKey);
          // 进行set重写
          rewritePropertyDescriptor(this.pageModel.componentsArray, targetComponent, currentAttr, currentKey, bindKey, src);
          // 初次重写完成后调用一次数据绑定
          proxySetFN(this.pageModel.componentsArray, bindKey, src, targetComponent.id);
        });
      }
    });
  }
}
