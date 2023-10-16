import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import cssIndex from "./index.scss?inline";

@customElement("q-save-button")
export class QSaveButton extends LitElement {
    constructor() {
        super();
    }

    static styles = [
        css`
      ${unsafeCSS(cssIndex)}
    `,
    ];

    //按钮类型
    @property({ type: Object, attribute: "ctx" })
    ctx: any;

    public render() {
        return html`
            <button @click="${this.clickButton}">保存</button>
    `;
    }

    clickButton() {
        console.log(12312312);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "q-save-button": QSaveButton;
    }
}
