import { createPopper } from "@popperjs/core";
import { Placement } from "@popperjs/core/lib/enums";
import { css, html, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";
import { classNames } from "../../common";
import { Component } from "../../types/runtime/Component";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform } from "../../util/utils";
import cssIndex from "./index.scss?inline";
import { styleMap } from "lit/directives/style-map.js";
import { customHasElement } from "../../types/runtime/decorators/decorators";

@customHasElement("q-popover")
export class QPopover extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("click", this._handle);
  }

  disconnectedCallback() {
    window.removeEventListener("click", this._handle);
    super.disconnectedCallback();
  }

  private _handle = (e: any) => {
    let i = 0;
    const item = e?.composedPath?.() || [];
    this.clickSelf = false;
    while (item[i]) {
      if (item[i]?.getAttribute && item[i]?.getAttribute("slot") === "popover") break;
      if (item[i] === this) {
        this.clickSelf = true;
        break;
      }
      i++;
    }
    if (this.isShow && !this.clickSelf) {
      this.leave();
    }
  };

  @property({ type: String })
  public position: Placement = "bottom";

  @property({ type: String })
  public effect = "light";

  @property({ type: String })
  public trigger = "click";

  // 跟随父级宽度
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public block = true;

  @property({ type: String })
  public content = "";

  private timeout: any;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public isShow = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
    attribute: "show_arrow",
  })
  public showArrow = true;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  private appear = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public disappear = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public disabled = false;

  @query("slot")
  public slotWC!: HTMLSlotElement;

  @query("[name=popover]")
  public slotPopoverWC!: HTMLSlotElement;

  @query(".tip")
  public tip!: HTMLElement;

  private popper: any = null;
  private clickSelf = false;

  public openEmit() {
    // 分发open事件
    DOMEmit(this, "open", { detail: null });
  }

  public closeEmit() {
    // 分发close事件
    DOMEmit(this, "close", { detail: null });
  }

  public onEnter = (evt: any) => {
    if (this.disabled) return;
    clearTimeout(this.timeout);
    if (this.trigger === "click") {
      this.isShow = !this.isShow;
    } else if (this.trigger === "hover") {
      this.isShow = true;
    }
    this.clickSelf = true;
    if (this.isShow) {
      this.appear = true;
      this.disappear = false;
      this.openEmit();
    } else {
      this.appear = false;
      this.disappear = true;
      this.closeEmit();
    }
    //html 模式过滤文本
    const tip: Element = this.slotWC.assignedNodes().find((node) => node.nodeType !== 3) as Element;

    this.popper = createPopper(tip, this.tip, {
      placement: this.position,
      modifiers: [
        {
          name: "offset",
          options: {
            offset: this.showArrow ? [6, 6] : [2, 2],
          },
        },
        {
          name: "computeStyles",
          options: {
            adaptive: false, // true by default
          },
        },
      ],
    });
    // evt.stopPropagation();

    let i = 0;
    const reEntrust = [0, 0];
    const item = evt?.composedPath?.() || [];
    let modalEventLayer = null;
    while (item[i]) {
      if (item[i]?.tagName === "Q-MODAL") {
        reEntrust[0] = 1;
        modalEventLayer = item[i].shadowRoot.querySelector(".ant-modal-wrap");
      }
      if (item[i]?.tagName === "Q-CHILD-PAGE") reEntrust[1] = 1;
      i++;
    }
    if (reEntrust.every((v) => v)) {
      modalEventLayer.addEventListener("click", this._handle);
    }
  };

  public onEnterPopover = (evt: any) => {
    clearTimeout(this.timeout);
    evt.stopPropagation();
  };

  public updatePosition() {
    this.popper && this.popper!.update();
  }

  public leave() {
    this.appear = false;
    this.disappear = true;
    setTimeout(() => {
      this.isShow = false;
      this.closeEmit();
    }, 0);
  }

  public onLeavePopover = () => {
    if (this.trigger === "hover") {
      this.timeout = setTimeout(() => {
        this.leave();
      }, 100);
    }
  };

  public onLeave = (e: any) => {
    this.timeout = setTimeout(() => {
      this.leave();
    }, 100);
  };

  public onPopoverClick = () => {
    this.closeEmit();
    this.isShow = false;
  };

  public override render() {
    const targetEvents: {
      mouseenter: (e: Event) => void;
      mouseleave: (e: Event) => void;
      click: (e: Event) => void;
    } = {
      mouseenter: null,
      mouseleave: null,
      click: null,
    } as any;

    if (this.trigger === "click") {
      targetEvents.click = this.onEnter;
    } else if (this.trigger === "hover") {
      targetEvents.mouseenter = this.onEnter;
      targetEvents.mouseleave = this.onLeave;
    }
    return html`
      <div 
        style="position:relative;width:100%;height:100%"
        appear=${this.appear} 
        disappear=${this.disappear} name="fade"
      >
        <slot 
          @click=${targetEvents.click}
          @mouseenter=${targetEvents.mouseenter}
          @mouseleave=${targetEvents.mouseleave}
        ></slot>
        <div
          style=${`display: ${this.isShow ? "block" : "none"}; min-width: ${this.block ? "100%" : ""}`}
          class=${classNames({
            tip: true,
            [`is-${this.effect}`]: this.effect,
          })}
        >
          <slot @mouseenter=${this.onEnterPopover} @mouseleave=${this.onLeavePopover} name="popover"></slot>
          <i class="tip-arrow" data-popper-arrow style=${styleMap({
            display: this.showArrow ? "block" : "none",
          })}></slot>
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-popover": QPopover;
  }
}
