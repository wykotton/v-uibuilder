
type AreaType = 'leftArea' | 'topArea' | 'rightArea' | 'bottomArea';

/**
 * 插件实例化参数
 */
export interface IPluginOption {
    area: AreaType,
    type: string,
    name: string,
    pageName: string,
    content: any,
    props?: {
        [key: string]: any;
    }
}

/**
 * Designer骨架API模块
 */
interface IPublicApiSkeleton {
    /**
     * 增加一个面板实例
     * @param config
     * @param extraConfig
     * @returns
     */
    add(config: IPluginOption, extraConfig?: Record<string, any>): any;
    /**
    * 移除一个面板实例
    * @param config
    * @returns
    */
    remove(config: IPluginOption): number | undefined;
    /**
     * 显示面板
     * @param name
     */
    showPanel(name: string): void;
    /**
     * 隐藏面板
     * @param name
     */
    hidePanel(name: string): void;
}

/**
 * Designer编辑器热键
 */
interface IPublicApiHotkey {
    get callbacks(): any;
    /**
     * 绑定快捷键
     * @param combos 快捷键，格式如：['command + s'] 、['ctrl + shift + s'] 等
     * @param callback 回调函数
     * @param action
     * @returns
     */
    bind(combos: string[] | string, callback: () => void, action?: string): any;
}


/**
 * designer全局配置
 */
interface IDesignerConfig {
    private config;
    /**
     * 判断指定 key 是否有值
     * @param key
     * @returns
     */
    has(key: string): boolean;
    /**
     * 获取指定 key 的值
     * @param key
     * @param defaultValue
     * @returns
     */
    get(key: string, defaultValue?: any): any;
    /**
     * 设置指定 key 的值
     * @param key
     * @param value
     */
    set(key: string, value: any): void;
    /**
     * 批量设值，set 的对象版本
     * @param config
     */
    setConfig(config: {
        [key: string]: any;
    }): void;
}

/**
 * Designer上下文
 */
export interface IUIBuilderPluginContext {
    get skeleton(): IPublicApiSkeleton;
    get hotkey(): IPublicApiHotkey;
    get setters(): IPublicApiSetters;
    get config(): IDesignerConfig;
}