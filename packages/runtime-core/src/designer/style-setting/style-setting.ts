import styleParse from "style-to-object";

/**
 * 变更组件initStyle的指定数据
 * @param cssText
 * @param initStyle
 */
export function changeInitStyle(cssText = "", initStyle = "", keys: string[]) {
    const cssTextObject = (styleParse(cssText) as any) ?? {};
    const initStyleObject = (styleParse(initStyle) as any) ?? {};
    keys.forEach((key) => {
        cssTextObject[key] ? (initStyleObject[key] = cssTextObject[key]) : void 0;
    });
    let styleStr = "";
    for (const key in initStyleObject) {
        styleStr += `${key}: ${initStyleObject[key]};`;
    }
    return styleStr;
}

/**
 * 更新组件initStyle
 * @param element 组件元素
 * @param keys 需要更新的key
 * @param changeSetter 是否更新styleSetter
 */
export function useChangeInitStyle(element: any, keys: string[], changeSetter: boolean) {
    // 更新组件initStyle
    const cssText = element?.style?.cssText;
    const initStyle = element?.componentModel?.model?.initStyle;
    const newInitStyle = changeInitStyle(cssText, initStyle, keys);
    element.componentModel?.updateModelEntity?.(JSON.stringify({ initStyle: newInitStyle }));
}