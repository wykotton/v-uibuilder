// @ts-nocheck
/*
    定义对齐方法类
*/
export class Alignment {
  /**
   * 左对齐
   */
  public leftAlign() {
    if (!isPlane()) {
      alert("操作元素需要在一个父节点下");
      return;
    }
    const elementArr = $.makeArray($(".focus"));
    const minX: any = Math.min(
      ...elementArr.map((element: any) => element.getAttribute("data-x"))
    );
    const minLeft = Math.min(
      ...elementArr.map((element: any) =>
        element.style.left.replace("px", "").replace("%", "")
      )
    );
    elementArr.forEach((element) => {
      const dataY = element.getAttribute("data-y");
      element.setAttribute("data-x", minX);
      if (vm.percentOrabsolute === "absolute") {
        element.style.transform = `translate(${minX}px,${dataY}px)`;
      } else {
        element.style.left = `${minLeft}%`;
      }
    });
  }

  /**
   *右对齐
   */
  public rightAlign() {
    if (!isPlane()) {
      alert("操作元素需要在一个父节点下");
      return;
    }
    const elementArr = $.makeArray($(".focus"));
    const parentWidth = $(elementArr[0].parentElement).width();
    const maxX = Math.max(
      ...elementArr.map(
        (element) => Number(element.getAttribute("data-x")) + $(element).width()
      )
    );
  }
}
/**
 * 是否一个平面
 * @returns
 */
function isPlane() {
  const elementArr = $.makeArray($(".focus"));
  const [first] = elementArr;
  return elementArr.every(
    (element: any) => element.parentNode.id === (first?.parentNode as any).id
  );
}
