import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import cssIndex from "./index.scss?inline";

@customElement("q-page-header")
export class QPageHeader extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];
  @property({ type: String, attribute: "background" })
  public background = "";

  public render() {
    return html`
      <div class="headers" style="background:${this.background}">
        <div class="headers-content">
          <div class="left-content">
            <slot name="left"></slot>
          </div>
          <div class="center-content">
            <slot name="center"></slot>
          </div>
          <div class="right-content">
            <slot name="right"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-page-header": QPageHeader;
  }
}
