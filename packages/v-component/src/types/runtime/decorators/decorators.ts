import { isEqual } from "lodash-es";
import { ClassDescriptor, Constructor } from "./base";

/**
 * 属性变更监听器
 * @param options
 * @returns
 */
export function changeProperty(
  options: {
    callBack: (self: any, key: string, value: any) => any;
  } = { callBack: () => void 0 }
): any {
  return function (protoOrDescriptor: any, name: PropertyKey) {
    const targetDescriptor = Object.getOwnPropertyDescriptor(protoOrDescriptor, name) as { set: Function };

    Object.defineProperty(protoOrDescriptor, name, {
      ...targetDescriptor,
      set: function set(value: any) {
        const { callBack } = options;
        targetDescriptor?.set.call(this, value);
        if (this?.componentModel?.model && !isEqual(this.componentModel.model[name], value)) {
          this.componentModel.model[name] = value;
        }
        callBack && callBack(this, name as string, value);
      },
    });
  };
}

/**
 * 自定义事件分发
 * @param eventName  事件名
 * @param options 同customEventInit属性{detail:{},bubbles:true,composed:true}
 */
export function DOMEmit(eventName?: string, options?: object): any {
  return function (target: any, name: string, descriptor: any) {
    if (!target) return;
    const original = descriptor.value;

    if (typeof original !== "function") return;
    descriptor.value = function (...args: any[]) {
      if (typeof options !== "object") {
        options = { bubbles: true, cancelable: true };
      }
      const result = original.apply(this, args);
      const targetOptions = { ...options, detail: result };
      const event = new CustomEvent(eventName ?? name, targetOptions);

      this.dispatchEvent(event);
      return result;
    };
    return descriptor;
  };
}

/**
 * Allow for custom element classes with private constructors
 */
type CustomElementClass = Omit<typeof HTMLElement, "new">;

const legacyCustomElement = (tagName: string, clazz: CustomElementClass) => {
  if (!customElements || !customElements.get) return;
  if (customElements.get(tagName)) {
    console.error("元件已经注册");
    return;
  }
  customElements.define(tagName, clazz as CustomElementConstructor);
  // Cast as any because TS doesn't recognize the return type as being a
  // subtype of the decorated class when clazz is typed as
  // `Constructor<HTMLElement>` for some reason.
  // `Constructor<HTMLElement>` is helpful to make sure the decorator is
  // applied to elements however.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return clazz as any;
};

const standardCustomElement = (tagName: string, descriptor: ClassDescriptor) => {
  const { kind, elements } = descriptor;
  return {
    kind,
    elements,
    // This callback is called once the class is otherwise fully defined
    finisher(clazz: Constructor<HTMLElement>) {
      if (!customElements || !customElements.get) return;
      if (customElements.get(tagName)) {
        // console.error("元件已经注册");
        return;
      }
      customElements.define(tagName, clazz);
    },
  };
};

/**
 * 注册前判断是否已经注册
 *
 * ```js
 * @customHasElement('my-element')
 * class MyElement extends LitElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 * @category Decorator
 * @param tagName The tag name of the custom element to define.
 */
export const customHasElement = (tagName: string) => (classOrDescriptor: CustomElementClass | ClassDescriptor) =>
  typeof classOrDescriptor === "function"
    ? legacyCustomElement(tagName, classOrDescriptor)
    : standardCustomElement(tagName, classOrDescriptor as ClassDescriptor);
