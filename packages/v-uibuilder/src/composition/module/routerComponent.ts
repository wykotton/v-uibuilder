import { useAppStoreWithOut } from "@/store/modules/app";
import { ChangeConfigInfo } from "@/types/IRouterConfig";
import { message } from "ant-design-vue";

// pinia
const useAppStore = useAppStoreWithOut();

/**
 * 单独适配的插件元件
 */
const pluginsList = ["q-router-config", "q-attribute-bind"];

/**
 * designer选中元件后更新插件元件选中源
 * 这是designer对插件元件的单独适配
 */
export function changePluginSource() {
  if (useAppStore.pageModel?._selectedComponents.length === 1) {
    const id = useAppStore.pageModel._selectedComponents[0].id;
    if (!id) return;
    pluginsList.forEach((tagName: string) => {
      const pluginsElement = document.querySelectorAll(tagName);
      Array.from(pluginsElement).forEach((element: any) => {
        if (!element) return;
        element.src = id;
      });
    });
  }
}

/**
 * 路由关系图添加关系后更新路由配置项
 * 这是designer对路由配置元件的单独适配
 */
export function changeRouterRelationship(config: ChangeConfigInfo) {
  const routerConfig: any = document.querySelector("q-router-config");
  if (config && routerConfig) {
    routerConfig.config = config;
  }
}

/**
 * 双击路由关系图的关系后编辑路由配置项
 * 这是designer对路由配置元件的单独适配
 */
export function selectRouterInfo(value: string) {
  if (!value) return;
  const routerConfig: any = document.querySelector("q-router-config");
  if (!routerConfig) {
    message.destroy();
    message.error("未找到路由配置元件!");
    return;
  }
  routerConfig.select = value;
}
