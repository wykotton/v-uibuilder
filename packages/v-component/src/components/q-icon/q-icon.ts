import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import cssIndex from "./index.scss?inline";

@customElement("q-icon")
export class QIcon extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  @property({ type: String, attribute: "name" })
  public name = "";

  @property({ type: String, attribute: "margin" })
  public margin = "0px";

  @property({ type: String, attribute: "color" })
  public color = "rgb(89, 89, 89)";

  @property({ type: String, attribute: "title" })
  public title = "";

  @property({ type: String })
  public size = "";

  public render() {
    return html`
      <i
        title="${this.title}"
        class="q-icon-${this.name}"
        style="margin:${this.margin};color:${this.color};font-size:${this.size}px"
      />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-icon": QIcon;
  }
}
