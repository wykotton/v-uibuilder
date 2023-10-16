import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { deleteEvent } from "./delete";
import { onKeyDown, onKeyUp } from "@vueuse/core";
import { isPlane } from "./alignTools";
import { message } from "ant-design-vue";
import { ISchema } from "@/types/IModelSchema";
import { throttle } from "lodash-es";
import { useChangeInitStyle } from "./setting";
import { resetCanvasZoom } from "./zoom";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

/**
 * 监听键盘按键按下
 */
export function useKeyDownEvents() {
  onKeyDown(["Shift", "Control", " ", "0", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"], (e) => {
    switch (e.key) {
      case "Shift":
        useAppStore.setIsShiftKey(true);
        break;
      case "Control":
        useAppStore.setIsCtrlKey(true);
        resetCanvasZoom();
        break;
      case " ":
        useAppStore.setIsSpaceKey(true);
        break;
      case "0":
        useAppStore.setIsZeroKey(true);
        resetCanvasZoom();
        break;
      case "ArrowLeft":
        useKeyMove(e, "left");
        break;
      case "ArrowRight":
        useKeyMove(e, "right");
        break;
      case "ArrowUp":
        useKeyMove(e, "up");
        break;
      case "ArrowDown":
        useKeyMove(e, "down");
        break;
    }
  });
}

/**
 * 监听键盘按键抬起
 */
export function useKeyUpEvents() {
  onKeyUp(["Shift", "Control", " ", "0", "Delete"], (e) => {
    switch (e.key) {
      case "Shift":
        useAppStore.setIsShiftKey(false);
        break;
      case "Control":
        useAppStore.setIsCtrlKey(false);
        break;
      case " ":
        useAppStore.setIsSpaceKey(false);
        break;
      case "0":
        useAppStore.setIsZeroKey(false);
        break;
      case "Delete":
        deleteEvent();
        break;
    }
  });
}

/**
 * 添加键盘监听事件
 */
export function addKeyBoardEvents() {
  useKeyDownEvents();
  useKeyUpEvents();
}

/**
 * 方向键移动
 * @param event
 * @param type
 */
function useKeyMove(event: any, type: string) {
  if (!useAppStore?.pageModel.selectedComponents.length || useAppStore.isFocus) return;
  event.preventDefault();
  if (!isPlane()) {
    message.destroy();
    message.warning("只能移动同一平面内的组件!");
    return;
  }
  const components: HTMLElement[] = useAppStore.pageModel.selectedComponents.map((component: ISchema) => {
    return document.querySelector(`#${component.id}`);
  });
  components.forEach((element: HTMLElement) => {
    const width = Number(element.style.width.replace("px", "").replace("%", ""));
    const height = Number(element.style.height.replace("px", "").replace("%", ""));
    const top = Number(element.style.top.replace("px", "").replace("%", ""));
    const left = Number(element.style.left.replace("px", "").replace("%", ""));
    let parentWidth = 0;
    let parentHeight = 0;
    // 适配slot元素
    if (element.assignedSlot) {
      parentWidth = element.assignedSlot.clientWidth;
      parentHeight = element.assignedSlot.clientHeight;
    } else {
      parentWidth = (element.parentElement as HTMLElement).clientWidth;
      parentHeight = (element.parentElement as HTMLElement).clientHeight;
    }
    switch (type) {
      case "left":
        if (left <= 0) return;
        if (useAppStore.percentOrAbsolute === "absolute") {
          element.style.left = `${left - 1}px`;
        } else {
          // element.style.left = `${(((x - 1) / parentWidth) * 100).toFixed(2)}%`;
        }
        break;
      case "right":
        if (useAppStore.percentOrAbsolute === "absolute" ? left + width >= parentWidth : left + width >= 100) return;
        if (useAppStore.percentOrAbsolute === "absolute") {
          element.style.left = `${left + 1}px`;
        } else {
          // element.style.left = `${(((x + 1) / parentWidth) * 100).toFixed(2)}%`;
        }
        break;
      case "up":
        if (top <= 0) return;
        if (useAppStore.percentOrAbsolute === "absolute") {
          element.style.top = `${top - 1}px`;
        } else {
          // element.style.top = `${(((y - 1) / parentHeight) * 100).toFixed(2)}%`;
        }
        break;
      case "down":
        if (useAppStore.percentOrAbsolute === "absolute" ? top + height >= parentHeight : top + height >= 100) return;
        if (useAppStore.percentOrAbsolute === "absolute") {
          element.style.top = `${top + 1}px`;
        } else {
          // element.style.top = `${(((y + 1) / parentHeight) * 100).toFixed(2)}%`;
        }
        break;
    }
  });
  updateMoveStyle(components);
  // 更新moveable辅助框，防止产生偏移
  useSettingStore.moveableExample.updateMoveable();
}

/**
 * keyMove后更新initStyle
 * @param components
 */
const updateMoveStyle = throttle((components: HTMLElement[]) => {
  const changeSetter = components.length === 1;
  components.forEach((element: any) => {
    useChangeInitStyle(element, ["left", "top"], changeSetter);
  });
}, 500);
