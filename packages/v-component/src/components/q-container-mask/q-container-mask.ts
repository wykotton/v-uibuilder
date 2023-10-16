import { customHasElement } from "../../types/runtime/decorators/decorators";
import { css, html, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import cssIndex from "./index.scss?inline";

@customHasElement("q-container-mask")
export class QContainerMask extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];
  
  @property({ type: Boolean })
  public noborder = false;

  @property({ type: String })
  public customStyle = "";
  
  @property({ type: String })
  public text = "";

  @query(".q-container-mask")
  container!: HTMLElement;

  dragenter() {
    if (!this.container) return;
    this.container.style.backgroundColor = "#B0CDF5";
  }

  dragleave() {
    if (!this.container) return;
    this.container.style.backgroundColor = "#f1f1f1";
  }

  public render() {
    return html`
      <div style="${this.customStyle ? this.customStyle : ""}" class="q-container-mask ${this.noborder ? "noborder" : ""}" @dragenter=${this.dragenter} @dragleave=${this.dragleave} @drop=${this.dragleave}>
        ${this.text}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-container-mask": QContainerMask;
  }
}
