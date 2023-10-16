import { PageNameEnum, EditAreaEnum } from "../enum/public";
import { IPluginsConfigData, IWidgetBaseConfig } from "../types/skeleton";

export class Skeleton {
  /**
   * 插件注册数据
   */
  public pluginsConfig: IPluginsConfigData = {
    edit: {
      leftArea: [],
      rightArea: [],
      topArea: [],
      bottomArea: [],
    },
  };
  /**
   * 增加一个面板实例
   * @param config
   * @param extraConfig
   * @returns
   */
  add(config: IWidgetBaseConfig, extraConfig?: Record<string, any>): any {
    if (!config.page) return;
    addConfig(this, config);
  }
}

/**
 * 添加各页面扩展注册数据
 * @param skeleton
 * @param config
 */
function addConfig(skeleton: Skeleton, config: IWidgetBaseConfig) {
  switch (config.page) {
    case PageNameEnum.EDIT:
      addEditConfig(skeleton, config);
      break;
    case PageNameEnum.WORKSPACE:
      break;
    case PageNameEnum.SETTING:
      break;
    case PageNameEnum.WEBSITE:
      break;
  }
}

/**
 * 添加编辑页面扩展注册数据
 * @param skeleton
 * @param config
 */
function addEditConfig(skeleton: Skeleton, config: IWidgetBaseConfig) {
  switch (config.area) {
    case EditAreaEnum.LEFT_AREA:
      skeleton.pluginsConfig.edit.leftArea.push(config);
      break;
    case EditAreaEnum.RIGHT_AREA:
      skeleton.pluginsConfig.edit.rightArea.push(config);
      break;
    case EditAreaEnum.TOP_AREA:
      skeleton.pluginsConfig.edit.topArea.push(config);
      break;
    case EditAreaEnum.BOTTOM_AREA:
      skeleton.pluginsConfig.edit.bottomArea.push(config);
      break;
  }
}
