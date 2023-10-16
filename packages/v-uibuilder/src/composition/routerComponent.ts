import { useAppStoreWithOut } from "@/store/modules/app";
import { ChangeConfigInfo } from "@/types/IRouterConfig";
import { message } from "ant-design-vue";

// pinia
const useAppStore = useAppStoreWithOut();

/**
 * designer选中元件后更新路由配置选中源
 * 这是designer对路由配置元件的单独适配
 */
export function changeRouterSource() {
  if (useAppStore.pageModel?._selectedComponents.length === 1) {
    const id = useAppStore.pageModel._selectedComponents[0].id;
    const routerConfig: any = document.querySelector("q-router-config");
    if (id && routerConfig) {
      routerConfig.src = id;
    }
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
