import { message } from "ant-design-vue";
import { changeInitStyle } from "../style-setting";

/**
 * 组件切换容器
 * @param slotName
 * @param target
 */
export function changeContainer(slotName: string, target: HTMLElement, left: number, top: number) {
    if (!target) {
        message.error("组件不存在!");
        return;
    }
    const id = target.id;
    const component = document.querySelector(`#${id}`) as any;
    if ($(target).parents(`#${id}`).length || component?.id === target.id) {
        message.destroy();
        message.warning("不可放入组件自身容器内|部！");
        return;
    }
    if (component?.parentElement?.id === target.id && component.slot === slotName) {
        message.destroy();
        message.warning("组件已在当前容器内|部！");
        return;
    }
    // 向目|标组件插入当前组件
    slotName ? (component.slot = slotName) : (component.slot = "");
    target.appendChild(component);
    // 变更组件坐标
    component.style.left = (left || 0) + "px";
    component.style.top = (top || 0) + "px";
    // 更新组件initStyle
    const cssText = component.style.cssText;
    const initStyle = component.componentModel.model.initStyle;
    const newInitStyle = changeInitStyle(cssText, initStyle, ["left", "top"]);
    return newInitStyle;
} 