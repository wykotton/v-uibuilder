/*
 * 单组件/多组件蒙层
 */
export function addComponentMask(element: HTMLElement | HTMLElement[]) {
  const maskElement = createMask();
  if (Array.isArray(element)) {
    element.forEach((item: HTMLElement) => {
      addMask(item, maskElement);
    });
  } else {
    addMask(element, maskElement);
  }
}

/*
 * 隐藏蒙层
 */
export function removeComponentMask(element: HTMLElement | HTMLElement[]) {
  if (Array.isArray(element)) {
    element.forEach((item: HTMLElement) => {
      const maskEle = Array.from(item.children).filter(
        (children) => children.slot === "q-component-mask"
      )[0] as HTMLElement;
      maskEle ? maskEle.remove() : void 0;
    });
  } else {
    const maskEle = Array.from(element.children).filter(
      (children) => children.slot === "q-component-mask"
    )[0] as HTMLElement;
    maskEle ? maskEle.remove() : void 0;
  }
}

/*
 * 创建蒙层
 */
function createMask() {
  const mask = document.createElement("div");
  mask.slot = "q-component-mask";
  mask.style.cssText =
    "width: 100%;height: 100%;position: absolute;left: 0;top: 0;display: block;z-index: 9999;border: 4px solid red";
  mask.innerHTML = `
    <div style="width: 100%;height: 100%;background-color: rgba(188,190,196,0.5);display: flex;align-items: center;justify-content: center;">
			<span style="width: 24px;height: 24px;min-width: 24px;min-height: 24px;">
				<svg aria-hidden="true" style="width: 1em;height: 1em;vertical-align: -0.15em;fill: currentColor;overflow: hidden;font-size: 24px;">
					<use xlink:href="#icon-cuowu" style="color: red"></use>
        </svg>
			</span>
		</div>
    `;
  return mask;
}

/*
 * 添加蒙层
 */
function addMask(element: HTMLElement, maskElement: HTMLElement) {
  const maskSlot = element.shadowRoot?.querySelector("slot[name='q-component-mask']");
  maskSlot
    ? void 0
    : (() => {
        const slotElement = document.createElement("slot");
        slotElement.name = "q-component-mask";
        element.shadowRoot?.appendChild(slotElement);
      })();
  const maskEle = Array.from(element.children).filter(
    (children) => children.slot === "q-component-mask"
  )[0] as HTMLElement;
  maskEle ? (maskEle.style.display = "block") : element.appendChild(maskElement.cloneNode(true));
}
