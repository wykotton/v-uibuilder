import { PageNameEnum } from "../enum/public";
import { IMaterialData } from "../types/material";

export class Material {
  /**
   * 各页面开放材料
   */
  edit: any = {};
  workspace: any = {};
  setting: any = {};
  website: any = {};
  /**
   * 增加材料
   * @param material
   * @returns
   */
  add(material: IMaterialData): any {
    if (!material.page) return;
    switch (material.page) {
      case PageNameEnum.EDIT:
        this[PageNameEnum.EDIT] = { ...this[PageNameEnum.EDIT], ...material.data };
        break;
      case PageNameEnum.WORKSPACE:
        this[PageNameEnum.WORKSPACE] = { ...this[PageNameEnum.WORKSPACE], ...material.data };
        break;
      case PageNameEnum.SETTING:
        this[PageNameEnum.SETTING] = { ...this[PageNameEnum.SETTING], ...material.data };
        break;
      case PageNameEnum.WEBSITE:
        this[PageNameEnum.WEBSITE] = { ...this[PageNameEnum.WEBSITE], ...material.data };
        break;
    }
  }
  /**
   * 移除材料
   * @param material
   * @param isAll
   * @returns
   */
  remove(material: IMaterialData, isAll?: boolean): any {
    if (!material.page) return;
    const removeMaterial = (page: string) => {
      if (isAll) {
        this[page] = {};
      } else {
        Object.keys(material.data).forEach((key: string) => {
          Reflect.deleteProperty(this[page], key);
        });
      }
    };
    switch (material.page) {
      case PageNameEnum.EDIT:
        removeMaterial(PageNameEnum.EDIT);
        break;
      case PageNameEnum.WORKSPACE:
        removeMaterial(PageNameEnum.WORKSPACE);
        break;
      case PageNameEnum.SETTING:
        removeMaterial(PageNameEnum.SETTING);
        break;
      case PageNameEnum.WEBSITE:
        removeMaterial(PageNameEnum.WEBSITE);
        break;
    }
  }
}
