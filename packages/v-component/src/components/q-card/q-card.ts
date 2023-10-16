import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { styleMap } from "lit/directives/style-map.js";

import cssIndex from "./index.scss?inline";

type ShadowEnums = "always" | "hover" | "never";

@customElement("q-card")
export class QCard extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `
  ];

  @property({ type: String })
  public header = "";

  @property({ type: Number, attribute: "width" })
  public width: Number = 400;

  @property({ type: Number, attribute: "maxheight" })
  public maxheight: Number = 1080;

  @property({ type: Number, attribute: "height" })
  public height: Number = 980;

  @property({ type: Object })
  public bodyStyle = {
    padding: "8px",
    textAlign: "center",
    maxHeight: `${this.maxheight}px`
  };

  @property({ type: String, attribute: "trigger" })
  public shadow: ShadowEnums = "never";

  @property({ type: Boolean })
  public headerShow = true;

  public render() {
    return html`
      <div
        class="${this.shadow
          ? "is-" + this.shadow + "-shadow q-card"
          : "is-always-shadow q-card"}"
        style="width:${this.width}px;height:${this.height}px;overflow-y:auto"
      >
        <div class="q-card_body" style="${styleMap(this.bodyStyle)}">
          <slot></slot>
        </div>
        ${this.headerShow
          ? html`
            <div
              class="q-card_header"
              style="white-space: nowrap;
                     text-overflow: ellipsis;
                     overflow: hidden;
                     padding:2px 0px;
                     "
            >
              <slot name="header" id="slotHeader">${this.header || ""}</slot>
            </div>
          `
          : null}
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-card": QCard;
  }
}
