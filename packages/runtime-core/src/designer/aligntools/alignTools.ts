import { IComponent, ISchema, PositionEnum } from "@zzjz/v-uibuilder-types";
import { message } from "ant-design-vue";
import { mergeWith } from "lodash-es";
import styleParse from "style-to-object";
import { useChangeInitStyle } from "../style-setting";

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
interface QuickAlignmentOperation {
  key: "2-1" | "2-2" | "2-3" | "2-4" | "2-5" | "2-6" | "2-7" | "2-8" | "2-9" | "2-10" | "2-11";
  percentOrAbsolute: PositionEnum;
  elementArr: IComponent[];
}

/**
 * 快捷对齐操作
 * @param key
 */
export function useAlignmentEvents(item: QuickAlignmentOperation) {
  const { key, percentOrAbsolute, elementArr } = item;
  switch (key) {
    case "2-1":
      leftAlign(percentOrAbsolute, elementArr);
      break;
    case "2-2":
      rightAlign(percentOrAbsolute, elementArr);
      break;
    case "2-3":
      topAlign(percentOrAbsolute, elementArr);
      break;
    case "2-4":
      bottomAlign(percentOrAbsolute, elementArr);
      break;
    case "2-5":
      horizontalAlign(percentOrAbsolute, elementArr);
      break;
    case "2-6":
      verticalAlign(percentOrAbsolute, elementArr);
      break;
    case "2-7":
      horizontalDistribution(percentOrAbsolute, elementArr);
      break;
    case "2-8":
      verticalDistribution(percentOrAbsolute, elementArr);
      break;
    case "2-9":
      equalHeight(percentOrAbsolute, elementArr);
      break;
    case "2-10":
      equalWidth(percentOrAbsolute, elementArr);
      break;
    case "2-11":
      equalSize(percentOrAbsolute, elementArr);
      break;
  }
}

/**
 * 左对齐
 */
function leftAlign(percentOrAbsolute: PositionEnum = PositionEnum.ABSOLUTE, elementArr: IComponent[] = []) { 
  if (!checkCondition(elementArr)) return;
  const minLeft = Math.min(...elementArr.map((element) => formatStyleUnit(element, AlignConstantEnum.LEFT)));
  elementArr.forEach((element) => {
    console.log(percentOrAbsolute);
    
    if (percentOrAbsolute === PositionEnum.ABSOLUTE) {
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
function rightAlign(percentOrAbsolute: PositionEnum = PositionEnum.ABSOLUTE, elementArr: IComponent[] = []) {
  if (!checkCondition()) return;
  const { parentWidth } = getParentRect(elementArr[0]);
  const maxRight = Math.max(
    ...elementArr.map(
      (element) => formatStyleUnit(element, AlignConstantEnum.LEFT) + formatStyleUnit(element, AlignConstantEnum.WIDTH)
    )
  );
  elementArr.forEach((element) => {
    const elementWidth = formatStyleUnit(element, AlignConstantEnum.WIDTH);
    if (percentOrAbsolute === PositionEnum.ABSOLUTE) {
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
function topAlign(percentOrAbsolute: PositionEnum = PositionEnum.ABSOLUTE, elementArr: IComponent[] = []) {
  if (!checkCondition()) return;
  const minTop = Math.min(...elementArr.map((element) => formatStyleUnit(element, AlignConstantEnum.TOP)));
  elementArr.forEach((element) => {
    if (percentOrAbsolute === PositionEnum.ABSOLUTE) {
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
function bottomAlign(percentOrAbsolute: PositionEnum = PositionEnum.ABSOLUTE, elementArr: IComponent[] = []) {
  if (!checkCondition()) return;
  const { parentHeight } = getParentRect(elementArr[0]);
  const maxBottom = Math.max(
    ...elementArr.map(
      (element) => formatStyleUnit(element, AlignConstantEnum.TOP) + formatStyleUnit(element, AlignConstantEnum.HEIGHT)
    )
  );
  elementArr.forEach((element) => {
    const elementHeight = formatStyleUnit(element, AlignConstantEnum.HEIGHT);
    if (percentOrAbsolute === PositionEnum.ABSOLUTE) {
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
function horizontalAlign(percentOrAbsolute: PositionEnum = PositionEnum.ABSOLUTE, elementArr: IComponent[] = []) {
  if (!checkCondition()) return;
  const lastElement = elementArr[elementArr.length - 1];
  const lastElementTop = formatStyleUnit(lastElement, AlignConstantEnum.TOP);
  const lastElementHeight = formatStyleUnit(lastElement, AlignConstantEnum.HEIGHT);
  const { parentHeight } = getParentRect(elementArr[0]); // 父级高度用于边界处理，防止超出边界
  elementArr.forEach((element) => {
    if (element.id === lastElement.id) return;
    const elementHeight = formatStyleUnit(element, AlignConstantEnum.HEIGHT);
    let targetTop = lastElementTop + lastElementHeight / 2 - elementHeight / 2;
    if (percentOrAbsolute === PositionEnum.ABSOLUTE) {
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
function verticalAlign(percentOrAbsolute: PositionEnum = PositionEnum.ABSOLUTE, elementArr: IComponent[] = []) {
  if (!checkCondition()) return;
  const lastElement = elementArr[elementArr.length - 1];
  const lastElementLeft = formatStyleUnit(lastElement, AlignConstantEnum.LEFT);
  const lastElementWidth = formatStyleUnit(lastElement, AlignConstantEnum.WIDTH);
  const { parentWidth } = getParentRect(elementArr[0]); // 父级宽度用于边界处理，防止超出边界
  elementArr.forEach((element) => {
    if (element.id === lastElement.id) return;
    const elementWidth = formatStyleUnit(element, AlignConstantEnum.WIDTH);
    let targetLeft = lastElementLeft + lastElementWidth / 2 - elementWidth / 2;
    if (percentOrAbsolute === PositionEnum.ABSOLUTE) {
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
function horizontalDistribution(percentOrAbsolute: PositionEnum = PositionEnum.ABSOLUTE, elementArr: IComponent[] = []) {
  if (!checkCondition()) return;
  if (elementArr.length <= 2) return;
  // if (checkLocking("所选组件包含被锁定组件，横向分布已禁用！")) return;
  const sortElement = elementArr.slice().sort((a, b) => {
    const { left: aLeft } = mergeDOMModelStyle(a) as { [key: string]: string };
    const { left: bLeft } = mergeDOMModelStyle(b) as { [key: string]: string };

    return parseInt(aLeft) - parseInt(bLeft);
  });
  const maxElement = elementArr.slice().sort((a: IComponent, b: IComponent) => {
    const { left: aLeft, width: aWidth } = mergeDOMModelStyle(a) as { [key: string]: string };
    const { left: bLeft, width: bWidth } = mergeDOMModelStyle(b) as { [key: string]: string };

    return parseInt(aLeft) + parseInt(aWidth) - (parseInt(bLeft) + parseInt(bWidth));
  });
  const firstElement = sortElement[0];
  const lastElement = maxElement[maxElement.length - 1];
  const { width, left } = mergeDOMModelStyle(lastElement) as { [key: string]: string };
  const { left: fLeft } = mergeDOMModelStyle(firstElement) as { [key: string]: string };
  const allElementLength = sortElement.reduce((pre, cur) => {
    const { width } = mergeDOMModelStyle(cur) as { [key: string]: string };
    return pre + parseInt(width);
  }, 0);
  const selectAreaWidth = parseInt(left) - parseInt(fLeft) + parseInt(width);
  const restWidth = selectAreaWidth - allElementLength;
  const averageWidth = restWidth / (elementArr.length - 1);
  const parentWidth = (elementArr[0].parentNode as IComponent).clientWidth; // 父级宽度用于边界处理，防止超出边界

  sortElement.forEach((element, index) => {
    if (!index || sortElement.length - 1 === index) return;
    if (percentOrAbsolute === PositionEnum.ABSOLUTE) {
      const { left: sLeft, width: sWidth } = mergeDOMModelStyle(sortElement[index - 1]) as { [key: string]: string };
      element.style.left = `${parseInt(sLeft) + parseInt(sWidth) + averageWidth}px`;
    } else {
      element.style.left = `${Number((averageWidth / parentWidth) * 100).toFixed(2)}%`;
    }
    useChangeInitStyle(element, [AlignConstantEnum.LEFT], false);
  });
}

/**
 * 垂直分布
 */
function verticalDistribution(percentOrAbsolute: PositionEnum = PositionEnum.ABSOLUTE, elementArr: IComponent[] = []) {
  if (!checkCondition()) return;
  if (elementArr.length <= 2) return;
  // if (checkLocking("所选组件包含被锁定组件，横向分布已禁用！")) return;
  const sortElement = elementArr.slice().sort((a: any, b: any) => {
    const { top: aTop } = mergeDOMModelStyle(a) as { [key: string]: string };
    const { top: bTop } = mergeDOMModelStyle(b) as { [key: string]: string };

    return parseInt(aTop) - parseInt(bTop);
  });
  const maxElement = elementArr.slice().sort((a: any, b: any) => {
    const { top: aTop, height: aHeight } = mergeDOMModelStyle(a) as { [key: string]: string };
    const { top: bTop, height: bHeight } = mergeDOMModelStyle(b) as { [key: string]: string };

    return parseInt(aTop) + parseInt(aHeight) - (parseInt(bTop) + parseInt(bHeight));
  });
  const firstElement = sortElement[0];
  const lastElement = maxElement[maxElement.length - 1];
  const { height, top } = mergeDOMModelStyle(lastElement) as { [key: string]: string };
  const { top: fTop } = mergeDOMModelStyle(firstElement) as { [key: string]: string };
  const allElementLength = sortElement.reduce((pre, cur: any) => {
    const { height } = mergeDOMModelStyle(cur) as { [key: string]: string };
    return pre + parseInt(height);
  }, 0);
  const selectAreaHeight = parseInt(top) - parseInt(fTop) + parseInt(height);
  const restHeight = selectAreaHeight - allElementLength;
  const averageHeight = restHeight / (elementArr.length - 1);
  const parentHeight = (elementArr[0].parentNode as IComponent).clientWidth; // 父级宽度用于边界处理，防止超出边界

  sortElement.forEach((element, index) => {
    if (!index || sortElement.length - 1 === index) return;
    if (percentOrAbsolute === PositionEnum.ABSOLUTE) {
      const { top: sTop, height: sHeight } = mergeDOMModelStyle(sortElement[index - 1]) as { [key: string]: string };
      element.style.top = `${parseInt(sTop) + parseInt(sHeight) + averageHeight}px`;
    } else {
      element.style.top = `${Number((averageHeight / parentHeight) * 100).toFixed(2)}%`;
    }
    useChangeInitStyle(element, [AlignConstantEnum.TOP], false);
  });
}

/**
 * 等高
 */
function equalHeight(percentOrAbsolute: PositionEnum = PositionEnum.ABSOLUTE, elementArr: IComponent[] = []) {
  if (!checkCondition()) return;
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
function equalWidth(percentOrAbsolute: PositionEnum = PositionEnum.ABSOLUTE, elementArr: IComponent[] = []) {
  if (!checkCondition()) return;
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
export function equalSize(
  percentOrAbsolute: PositionEnum = PositionEnum.ABSOLUTE,
  elementArr: IComponent[] = []
) {
  if (!checkCondition()) return;
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
export function isPlane(selectedComponents: IComponent[]) {
  const elementArr = selectedComponents;
  const [first] = elementArr;
  const firstElement: any = document.querySelector(`#${first.id}`);
  if (!firstElement) return false;
  return elementArr.every((component: IComponent) => {
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
function checkCondition(selectedComponents: IComponent[] = []) {
  if (!(selectedComponents.length > 1)) return false;
  if (!isPlane(selectedComponents)) {
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
function getParentRect(element: IComponent) {
  const parentWidth = element.assignedSlot
    ? element.assignedSlot.clientWidth
    : (element.parentNode as IComponent).clientWidth;
  const parentHeight = element.assignedSlot
    ? element.assignedSlot.clientHeight
    : (element.parentNode as IComponent).clientHeight;
  return { parentWidth, parentHeight };
}

/**
 * 格式化style单位
 * @param element
 * @param type
 * @returns
 */
export function formatStyleUnit(element: IComponent & any, type: string) {
  const { height, width, left, top } = mergeDOMModelStyle(element) as { [key: string]: string };

  switch (type) {
    case AlignConstantEnum.LEFT:
      return parseInt(left);
    case AlignConstantEnum.TOP:
      return parseInt(top);
    case AlignConstantEnum.WIDTH:
      return parseInt(width);
    case AlignConstantEnum.HEIGHT:
      return parseInt(height);
  }
  return 0;
}

/**
 * 获取元件DOM数组
 * @returns
 */
function getElementArr(selectedComponents: ISchema[] = []) {
  return selectedComponents.filter((component: ISchema) =>
    document.querySelector(`#${component.id}`)
  ) as unknown as IComponent[];
} 

/**
 * 合并dom与model的样式
 * @param element dom
 * @returns
 */
function mergeDOMModelStyle(element: IComponent | any): { [key: string]: any } {
  const domObj = styleParse(element.style.cssText);
  const modelObj = styleParse(element.componentModel.model.initStyle);

  return mergeWith(domObj, modelObj, customizer) || {};
}

function customizer(objValue: string, srcValue: string) {
  if (!objValue) {
    return srcValue;
  }
  return;
}
