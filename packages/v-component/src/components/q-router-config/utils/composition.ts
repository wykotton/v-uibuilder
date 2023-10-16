import { IRouterConfig, IRouterInfo, ISchema } from "@zzjz/v-uibuilder-types";
import { cloneDeep } from "lodash-es";

/**
 * 下拉框搜索元件
 * @param input
 * @param option
 * @returns
 */
export function filterComponent(input: string, option: any) {
  if (option.componentAliasName) {
    return (
      option.componentAliasName.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
      `ID: ${option.value}`.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  } else if (option.text) {
    return (
      option.text.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
      `ID: ${option.value}`.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  } else {
    return (
      "未命名元件".toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
      `ID: ${option.value}`.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  }
}

/**
 * 下拉框搜索页面
 * @param input
 * @param option
 * @returns
 */
export function filterPage(input: string, option: any) {
  return (
    option.page.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
    `ID: ${option.value}`.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
}

/**
 * 对组件数据进行分组
 * @param components
 * @returns
 */
export function transformGroup(components: ISchema[]) {
  const list = {};
  components.forEach((item: ISchema) => {
    const iovSchema = item?.iovSchema;
    const componentAliasName = item?.componentAliasName || "";
    const text = item?.iovSchema?.text || "";
    const id = item.id;
    const info = { id, text, componentAliasName, iovSchema };
    if (id) {
      list?.[text] ? void 0 : (list[text] = []);
      list[text].push(info);
    }
  });
  return list;
}

/**
 * 获取当前页面可选元件列表
 */
export function getCurrentPageComponents() {
  const componentClass = [".draggable2", ".child-page-children"];
  const tempList: ISchema[] = [];
  componentClass.forEach((selector: string) => {
    Array.from(document.querySelectorAll(selector)).forEach((element: any) => {
      const model = element?.componentModel?.model;
      if (model?.id) {
        tempList.push(model);
      }
    });
  });
  return transformGroup(tempList);
}

/**
 * 路由配置项搜索
 * @param data
 * @param defaultType
 * @param text
 * @returns
 */
export function routerSearch(data: IRouterConfig, defaultType: string, text: string) {
  const tempRouterConfig = {};
  try {
    Object.keys(data).forEach((key) => {
      if (!text) {
        data[key].forEach((item: IRouterInfo) => {
          if (item.type) {
            tempRouterConfig[item.type]
              ? tempRouterConfig[item.type].push(item)
              : (tempRouterConfig[item.type] = [item]);
          } else {
            tempRouterConfig[defaultType]
              ? tempRouterConfig[defaultType].push(item)
              : (tempRouterConfig[defaultType] = [item]);
          }
        });
        return;
      }
      data[key]?.forEach((item: IRouterInfo) => {
        if (item.title?.indexOf(text) > -1 || item.src?.indexOf(text) > -1) {
          const tempData = cloneDeep(item);
          if (tempData.title?.indexOf(text) > -1) {
            const replaceReg = new RegExp(text, "g"); // 匹配关键字正则
            const replaceString = '<span style="color: red">' + text + "</span>"; // 高亮替换v-html值
            tempData["titleHighlights"] = tempData.title.replace(replaceReg, replaceString);
          }
          if (tempData.src?.indexOf(text) > -1) {
            const replaceReg = new RegExp(text, "g"); // 匹配关键字正则
            const replaceString = '<span style="color: red">' + text + "</span>"; // 高亮替换v-html值
            tempData["srcHighlights"] = tempData.src.replace(replaceReg, replaceString);
          }
          if (item.type) {
            tempRouterConfig[item.type]
              ? tempRouterConfig[item.type].push(tempData)
              : (tempRouterConfig[item.type] = [tempData]);
          } else {
            tempRouterConfig[defaultType]
              ? tempRouterConfig[defaultType].push(tempData)
              : (tempRouterConfig[defaultType] = [tempData]);
          }
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
  return tempRouterConfig;
}
