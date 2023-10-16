import { PluginManager } from "./engine/plugins";
import { Skeleton } from "./engine/skeleton";
import { Material } from "./engine/material";

// 初始化插件实例
const plugins = new PluginManager();
const skeleton = new Skeleton();
const material = new Material();

// 插件实例上下文
export const pluginsContext = {
  plugins,
  skeleton,
  material,
};
