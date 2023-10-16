import { PositionEnum } from "@/enums/appEnum";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { ISchema } from "@/types/IModelSchema";
import { message } from "ant-design-vue";
import { isString, mergeWith } from "lodash-es";
import styleParse from "style-to-object";
import { useChangeInitStyle } from "./setting";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

/**
 * 对齐常量
 */
enum AlignConstantEnum {
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom",
  WIDTH = "width",
  HEIGHT = "height",
}

/**
 * 快捷对齐操作
 * @param key
 */
export function useAlignmentEvents(item: any) {
  switch (item.key) {
    case "2-1":
      leftAlign();
      break;
    case "2-2":
      rightAlign();
      break;
    case "2-3":
      topAlign();
      break;
    case "2-4":
      bottomAlign();
      break;
    case "2-5":
      centerAlign();
      break;
    case "2-6":
      verticalAlign();
      break;
    case "2-7":
      centerDistribution();
      break;
    case "2-8":
      verticalDistribution();
      break;
    case "2-9":
      equalAltitude();
      break;
    case "2-10":
      equalWidth();
      break;
    case "2-11":
      allelicWidthHeight();
      break;
  }
  // 更新moveable辅助框，防止产生偏移
  useSettingStore.moveableExample.updateMoveable();
}

/**
 * 左对齐
 */
function leftAlign() {
  if (!checkCondition()) return;
  const elementArr = getElementArr();
  const minLeft = Math.min(...elementArr.map((element) => formatStyleUnit(element, AlignConstantEnum.LEFT)));
  elementArr.forEach((element) => {
    if (useAppStore.percentOrAbsolute === PositionEnum.ABSOLUTE) {
      element.style.left = `${minLeft}px`;
    } else {
      element.style.left = `${minLeft}%`;
    }
    useChangeInitStyle(element, [AlignConstantEnum.LEFT], false);
  });
}

/**
 * 右对齐
 */
function rightAlign() {
  if (!checkCondition()) return;
  // if (checkLocking("所选组件包含被锁定组件，对齐操作已禁用！")) return;
  const elementArr = getElementArr();
  const { parentWidth } = getParentRect(elementArr[0]);
  const maxRight = Math.max(
    ...elementArr.map(
      (element) => formatStyleUnit(element, AlignConstantEnum.LEFT) + formatStyleUnit(element, AlignConstantEnum.WIDTH)
    )
  );
  elementArr.forEach((element) => {
    const elementWidth = formatStyleUnit(element, AlignConstantEnum.WIDTH);
    if (useAppStore.percentOrAbsolute === PositionEnum.ABSOLUTE) {
      element.style.left = `${(parentWidth < maxRight ? parentWidth : maxRight) - elementWidth}px`;
    } else {
      element.style.left = `${maxRight < 100 ? maxRight - elementWidth : 100 - elementWidth}%`;
    }
    useChangeInitStyle(element, [AlignConstantEnum.LEFT], false);
  });
}

/**
 * 顶端对齐
 */
function topAlign() {
  if (!checkCondition()) return;
  // if (checkLocking("所选组件包含被锁定组件，顶端对齐已禁用！")) return;
  const elementArr = getElementArr();
  const minTop = Math.min(...elementArr.map((element) => formatStyleUnit(element, AlignConstantEnum.TOP)));
  elementArr.forEach((element) => {
    if (useAppStore.percentOrAbsolute === PositionEnum.ABSOLUTE) {
      element.style.top = `${minTop}px`;
    } else {
      element.style.top = `${minTop}%`;
    }
    useChangeInitStyle(element, [AlignConstantEnum.TOP], false);
  });
}

/**
 * 底部对齐
 */
function bottomAlign() {
  if (!checkCondition()) return;
  // if (checkLocking("所选组件包含被锁定组件，底部对齐已禁用！")) return;
  const elementArr = getElementArr();
  const { parentHeight } = getParentRect(elementArr[0]);
  const maxBottom = Math.max(
    ...elementArr.map(
      (element) => formatStyleUnit(element, AlignConstantEnum.TOP) + formatStyleUnit(element, AlignConstantEnum.HEIGHT)
    )
  );
  elementArr.forEach((element) => {
    const elementHeight = formatStyleUnit(element, AlignConstantEnum.HEIGHT);
    if (useAppStore.percentOrAbsolute === PositionEnum.ABSOLUTE) {
      element.style.top = `${(parentHeight < maxBottom ? parentHeight : maxBottom) - elementHeight}px`;
    } else {
      element.style.top = `${maxBottom < 100 ? maxBottom - elementHeight : 100 - elementHeight}%`;
    }
    useChangeInitStyle(element, [AlignConstantEnum.TOP], false);
  });
}

/**
 * 水平对齐
 */
function centerAlign() {
  if (!checkCondition()) return;
  // if (checkLocking("所选组件包含被锁定组件，水平对齐已禁用！")) return;
  const elementArr = getElementArr();
  const lastElement = elementArr[elementArr.length - 1];
  const lastElementTop = formatStyleUnit(lastElement, AlignConstantEnum.TOP);
  const lastElementHeight = formatStyleUnit(lastElement, AlignConstantEnum.HEIGHT);
  const { parentHeight } = getParentRect(elementArr[0]); // 父级高度用于边界处理，防止超出边界
  elementArr.forEach((element) => {
    if (element.id === lastElement.id) return;
    const elementHeight = formatStyleUnit(element, AlignConstantEnum.HEIGHT);
    let targetTop = lastElementTop + lastElementHeight / 2 - elementHeight / 2;
    if (useAppStore.percentOrAbsolute === PositionEnum.ABSOLUTE) {
      targetTop =
        targetTop < 0 ? 0 : targetTop + elementHeight > parentHeight ? parentHeight - elementHeight : targetTop;
      element.style.top = `${targetTop}px`;
    } else {
      targetTop = targetTop < 0 ? 0 : targetTop + elementHeight > 100 ? 100 - elementHeight : targetTop;
      element.style.top = `${targetTop}%`;
    }
    useChangeInitStyle(element, [AlignConstantEnum.TOP], false);
  });
}

/**
 * 垂直对齐
 */
function verticalAlign() {
  if (!checkCondition()) return;
  // if (checkLocking("所选组件包含被锁定组件，垂直对齐已禁用！")) return;
  const elementArr = getElementArr();
  const lastElement = elementArr[elementArr.length - 1];
  const lastElementLeft = formatStyleUnit(lastElement, AlignConstantEnum.LEFT);
  const lastElementWidth = formatStyleUnit(lastElement, AlignConstantEnum.WIDTH);
  const { parentWidth } = getParentRect(elementArr[0]); // 父级宽度用于边界处理，防止超出边界
  elementArr.forEach((element) => {
    if (element.id === lastElement.id) return;
    const elementWidth = formatStyleUnit(element, AlignConstantEnum.WIDTH);
    let targetLeft = lastElementLeft + lastElementWidth / 2 - elementWidth / 2;
    if (useAppStore.percentOrAbsolute === PositionEnum.ABSOLUTE) {
      targetLeft =
        targetLeft < 0 ? 0 : targetLeft + elementWidth > parentWidth ? parentWidth - elementWidth : targetLeft;
      element.style.left = `${targetLeft}px`;
    } else {
      targetLeft = targetLeft < 0 ? 0 : targetLeft + elementWidth > 100 ? 100 - elementWidth : targetLeft;
      element.style.left = `${targetLeft}%`;
    }
    useChangeInitStyle(element, [AlignConstantEnum.LEFT], false);
  });
}

/**
 * 横向分布
 */
function centerDistribution() {
  if (!checkCondition()) return;
  const elementArr = getElementArr();
  if (elementArr.length <= 2) return;
  // if (checkLocking("所选组件包含被锁定组件，横向分布已禁用！")) return;
  const sortElement = elementArr.slice().sort((a, b) => {
    const { left: aLeft } = mergeDOMModelStyle(a) as { [key: string]: string };
    const { left: bLeft } = mergeDOMModelStyle(b) as { [key: string]: string };

    return getStyleNum(aLeft) - getStyleNum(bLeft)
  });
  const maxElement = elementArr
    .slice()
    .sort(
      (a: HTMLElement, b: HTMLElement) => {
        const { left: aLeft, width: aWidth } = mergeDOMModelStyle(a) as { [key: string]: string };
        const { left: bLeft, width: bWidth } = mergeDOMModelStyle(b) as { [key: string]: string };

        return getStyleNum(aLeft) +
          getStyleNum(aWidth) -
          (getStyleNum(bLeft) + getStyleNum(bWidth))
      }
    );
  const firstElement = sortElement[0];
  const lastElement = maxElement[maxElement.length - 1];
  const { width, left } = mergeDOMModelStyle(lastElement) as { [key: string]: string };
  const { left: fLeft } = mergeDOMModelStyle(firstElement) as { [key: string]: string };
  const allElementLength = sortElement.reduce((pre, cur) => {
    const { width } = mergeDOMModelStyle(cur) as { [key: string]: string };
    return pre + getStyleNum(width)
  }, 0);
  const selectAreaWidth =
    getStyleNum(left) - getStyleNum(fLeft) + getStyleNum(width);
  const restWidth = selectAreaWidth - allElementLength;
  const averageWidth = restWidth / (elementArr.length - 1);
  const parentWidth = (elementArr[0].parentNode as HTMLElement).clientWidth; // 父级宽度用于边界处理，防止超出边界

  sortElement.forEach((element, index) => {
    if (!index || sortElement.length - 1 === index) return;
    if (useAppStore.percentOrAbsolute === PositionEnum.ABSOLUTE) {
      const { left: sLeft, width: sWidth } = mergeDOMModelStyle(sortElement[index - 1]) as { [key: string]: string };
      element.style.left = `${getStyleNum(sLeft) + getStyleNum(sWidth) + averageWidth
        }px`;
    } else {
      element.style.left = `${Number((averageWidth / parentWidth) * 100).toFixed(2)}%`;
    }
    useChangeInitStyle(element, [AlignConstantEnum.LEFT], false);
  });
}

/**
 * 垂直分布
 */
function verticalDistribution() {
  if (!checkCondition()) return;
  const elementArr = getElementArr();
  if (elementArr.length <= 2) return;
  // if (checkLocking("所选组件包含被锁定组件，横向分布已禁用！")) return;
  const sortElement = elementArr.slice().sort((a: any, b: any) => {
    const { top: aTop } = mergeDOMModelStyle(a) as { [key: string]: string };
    const { top: bTop } = mergeDOMModelStyle(b) as { [key: string]: string };

    return getStyleNum(aTop) - getStyleNum(bTop)
  });
  const maxElement = elementArr
    .slice()
    .sort(
      (a: any, b: any) => {
        const { top: aTop, height: aHeight } = mergeDOMModelStyle(a) as { [key: string]: string };
        const { top: bTop, height: bHeight } = mergeDOMModelStyle(b) as { [key: string]: string };

        return getStyleNum(aTop) +
          getStyleNum(aHeight) -
          (getStyleNum(bTop) + getStyleNum(bHeight))
      }
    );
  const firstElement = sortElement[0];
  const lastElement = maxElement[maxElement.length - 1];
  const { height, top } = mergeDOMModelStyle(lastElement) as { [key: string]: string };
  const { top: fTop } = mergeDOMModelStyle(firstElement) as { [key: string]: string };
  const allElementLength = sortElement.reduce((pre, cur: any) => {
    const { height } = mergeDOMModelStyle(cur) as { [key: string]: string };
    return pre + getStyleNum(height)
  }, 0);
  const selectAreaHeight =
    getStyleNum(top) - getStyleNum(fTop) + getStyleNum(height);
  const restHeight = selectAreaHeight - allElementLength;
  const averageHeight = restHeight / (elementArr.length - 1);
  const parentHeight = (elementArr[0].parentNode as HTMLElement).clientWidth; // 父级宽度用于边界处理，防止超出边界

  sortElement.forEach((element, index) => {
    if (!index || sortElement.length - 1 === index) return;
    if (useAppStore.percentOrAbsolute === PositionEnum.ABSOLUTE) {
      const { top: sTop, height: sHeight } = mergeDOMModelStyle(sortElement[index - 1]) as { [key: string]: string };
      element.style.top = `${getStyleNum(sTop) + getStyleNum(sHeight) + averageHeight
        }px`;
    } else {
      element.style.top = `${Number((averageHeight / parentHeight) * 100).toFixed(2)}%`;
    }
    useChangeInitStyle(element, [AlignConstantEnum.TOP], false);
  });
}

/**
 * 等高
 */
function equalAltitude() {
  if (!checkCondition()) return;
  // if (checkLocking("所选组件包含被锁定组件，等高已禁用！")) return;
  const elementArr = getElementArr();
  const lastElement = elementArr[elementArr.length - 1] as any;
  const { height } = mergeDOMModelStyle(lastElement) as { [key: string]: string };
  const lastElementHeight = height;

  elementArr.forEach((element) => {
    element.style.height = lastElementHeight;
    useChangeInitStyle(element, [AlignConstantEnum.HEIGHT], false);
  });
}

/**
 * 等宽
 */
function equalWidth() {
  if (!checkCondition()) return;
  // if (checkLocking("所选组件包含被锁定组件，等高已禁用！")) return;
  const elementArr = getElementArr();
  const lastElement = elementArr[elementArr.length - 1] as any;
  const { width } = mergeDOMModelStyle(lastElement) as { [key: string]: string };
  const lastElementWidth = width;
  elementArr.forEach((element) => {
    element.style.width = lastElementWidth;
    useChangeInitStyle(element, [AlignConstantEnum.WIDTH], false);
  });
}

/**
 * 等尺寸
 */
export function allelicWidthHeight() {
  if (!checkCondition()) return;
  // if (checkLocking("所选组件包含被锁定组件，等尺寸已禁用！")) return;
  const elementArr = getElementArr();
  const lastElement = elementArr[elementArr.length - 1] as any;
  const { height, width } = mergeDOMModelStyle(lastElement) as { [key: string]: string };
  const lastElementWidth = width;
  const lastElementHeight = height;
  elementArr.forEach((element) => {
    if (element.id === lastElement.id) return;
    element.style.width = lastElementWidth;
    element.style.height = lastElementHeight;
    useChangeInitStyle(element, [AlignConstantEnum.WIDTH, AlignConstantEnum.HEIGHT], false);
  });
}

/**
 * 是否一个平面
 * @returns
 */
export function isPlane() {
  const elementArr = useAppStore.pageModel.selectedComponents;
  const [first] = elementArr;
  const firstElement: any = document.querySelector(`#${first.id}`);
  if (!firstElement) return false;
  return elementArr.every((component: ISchema) => {
    const element: any = document.querySelector(`#${component.id}`);
    if (!element) {
      return false;
    } else {
      return element.parentNode === firstElement.parentNode && element.assignedSlot === firstElement.assignedSlot;
    }
  });
}

/**
 * 检查操作条件
 * @returns
 */
function checkCondition() {
  if (!(useAppStore?.pageModel?.selectedComponents.length > 1)) return false;
  if (!isPlane()) {
    message.destroy();
    message.warning("操作元件需要在同一平面下!");
    return false;
  }
  return true;
}

/**
 * 获取父级容器宽高
 * @param element
 */
function getParentRect(element: HTMLElement) {
  const parentWidth = element.assignedSlot
    ? element.assignedSlot.clientWidth
    : (element.parentNode as HTMLElement).clientWidth;
  const parentHeight = element.assignedSlot
    ? element.assignedSlot.clientHeight
    : (element.parentNode as HTMLElement).clientHeight;
  return { parentWidth, parentHeight };
}

/**
 * 格式化style单位
 * @param element
 * @param type
 * @returns
 */
export function formatStyleUnit(element: HTMLElement & any, type: string) {
  const { height, width, left, top } = mergeDOMModelStyle(element) as { [key: string]: string };

  switch (type) {
    case AlignConstantEnum.LEFT:
      return Number((left).replace("px", "").replace("%", ""));
    case AlignConstantEnum.TOP:
      return Number((top).replace("px", "").replace("%", ""));
    case AlignConstantEnum.WIDTH:
      return Number((width).replace("px", "").replace("%", ""));
    case AlignConstantEnum.HEIGHT:
      return Number((height).replace("px", "").replace("%", ""));
  }
  return 0;
}

/**
 * 获取元件DOM数组
 * @returns
 */
function getElementArr() {
  const elementArr: HTMLElement[] = useAppStore.pageModel.selectedComponents.map((component: ISchema) => {
    return document.querySelector(`#${component.id}`);
  });
  return elementArr;
}

function getStyleNum(str: string) {
  if (!isString(str)) return 0;
  return Number(str.replace("px", "").replace("%", ""));
}

/**
 * 合并dom与model的样式
 * @param element dom
 * @returns 
 */
function mergeDOMModelStyle(element: HTMLElement | any): { [key: string]: any } {
  const domObj = styleParse(element.style.cssText);
  const modelObj = styleParse(element.componentModel.model.initStyle);

  return mergeWith(domObj, modelObj, customizer) || {};
}

function customizer(objValue: string, srcValue: string) {
  if (!objValue) {
    return srcValue;
  }
}
