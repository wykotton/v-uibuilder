import { css, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { customHasElement } from "../../types/runtime/decorators/decorators";
import { styleMap } from "lit/directives/style-map.js";
import { extractClass } from "../../common";
import { Component } from "../../types/runtime/Component";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform } from "../../util/utils";
import cssIndex from "./index.scss?inline";

type UISize = "large" | "default" | "small";

@customHasElement("q-select-option")
export class QSelectOption extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  @property({ type: String })
  public label = "";

  @property({ type: String })
  public value = "";

  @property({ type: String })
  public hoverBgColor = "rgb(245, 247, 250)";

  @property({ type: String })
  public hoverFontColor = "#000";

  @property({ type: String })
  public selectedBgColor = "rgb(255, 255, 255)";

  @property({ type: String })
  public selectedFontColor = "rgb(64, 158, 255)";

  @property({ type: String })
  public defaultFontColor = "#000";

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public disabled = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public visible = true;

  @property({ type: String })
  public size: UISize = "default";

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public selected = false;

  /**
   * 设置勾选
   * @param val
   */
  public setSelect(val: boolean) {
    this.selected = val;
  }

  /**
   * 更新是否显示
   * @param val
   */
  public setVisible(val: boolean) {
    this.visible = val;
  }

  public clickItem(e: Event) {
    e.stopPropagation();
    this.selected = !this.selected;
    const detail = {
      label: this.label,
      value: this.value,
      selected: this.selected,
    };
    DOMEmit(this, "change", { detail: detail });
  }

  public override render(_renderProps = {}, _store = {}) {
    const dyStyle = {
      visibility: !this.visible ? "hidden" : "visible",
      height: !this.visible ? "0" : "auto",
    };
    const spanBgStyle = {
      backgroundColor: this.selected ? this.selectedBgColor : "transparent",
      color: this.selected ? this.selectedFontColor : this.defaultFontColor,
    };
    return html`
      <div
        @mouseenter=${this.hoverStyleChange}
        class=${extractClass({}, "", {
          selected: this.selected,
          "is-disabled": this.disabled,
          "q-select-dropdown_item": true,
        })}
        style=${styleMap(dyStyle)}
        @click=${this.clickItem.bind(this)}
      >
        <span style=${styleMap(spanBgStyle)} class=${this.selected ? "selected" : ""}>${this.label}</span>
        ${this.selected
          ? html`
              <svg class="a3 a2" focusable="false" viewBox="0 0 24 24" aria-hidden="true" tabindex="-1">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            `
          : null}
      </div>
    `;
  }

  hoverStyleChange() {
    this.style.setProperty("--hoverColor", this.hoverBgColor);
    this.style.setProperty("--hoverFontColor", this.hoverFontColor);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-select-option": QSelectOption;
  }
}
