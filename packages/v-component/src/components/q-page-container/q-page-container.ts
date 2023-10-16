import { css, html, LitElement } from "lit";
import { customHasElement } from "../../types/runtime/decorators/decorators";

/**
 * 文本组件
 *
 */
@customHasElement("q-page-container")
export class QPageContainer extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="inner"></div>
      <div class="bottom"></div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "q-page-container": QPageContainer;
  }
}
