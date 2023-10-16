import { isBoolean } from "lodash-es";

/**
 * 自定义事件分发
 * @param element 事件对象
 * @param evtName  事件名
 * @param options 同customEventInit属性{detail:{},bubbles:true,composed:true}
 */
export function DOMEmit(element: HTMLElement, evtName: string, options: any) {
  const event: CustomEvent = new CustomEvent(evtName, {
    detail: options?.detail || null,
    bubbles: options && isBoolean(options.bubbles) ? options.bubbles : true,
    cancelable: options && isBoolean(options.cancelable) ? options.cancelable : true,
  });
  element.dispatchEvent(event);
}
