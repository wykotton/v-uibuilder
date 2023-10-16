import { pluginsContext } from "../index";

export class PluginManager {
  register(pluginConfigCreator: (ctx: any, options?: any) => any, options?: any, registerOptions?: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const config = pluginConfigCreator(pluginsContext);
        config?.init?.();
        resolve();
      } catch (error) {
        reject();
      }
    });
  }
}
