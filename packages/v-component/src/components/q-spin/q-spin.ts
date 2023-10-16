import {css, html, LitElement, unsafeCSS} from "lit";
import {customElement, property} from "lit/decorators.js";
import {ComponentModel} from "../../types/runtime/ComponentModel";
import cssIndex from "../q-spin/index.scss?inline";
import {classMap} from "lit/directives/class-map.js";
import {booleanTransform} from "../../util/utils";

/**
 * 文本组件
 *
 */
@customElement("q-spin")
export class QSpin extends LitElement {
    static styles = [css`
      ${unsafeCSS(cssIndex)}
    `];


    @property({type: String, attribute: "text"})
    text = "";

    @property({type: Boolean, attribute: "loading", reflect: true, converter(value, type?) {
            return booleanTransform(value);
        }})
    loading = false;

    /**
     * 数据模型
     */
    componentModel!: ComponentModel;

    constructor() {
        super();
    }


    render() {
        return html`
            <div class="q-spin-nested-loading">
                <div>
                    <div class=${classMap({"q-spin": true, "q-spin-spinning": this.loading, "notblock": !this.loading})}>
                        <span class="q-spin-dot q-spin-dot-spin">
                            <i class="q-spin-dot-item"></i>
                            <i class="q-spin-dot-item"></i>
                            <i class="q-spin-dot-item"></i>
                            <i class="q-spin-dot-item"></i>
                        </span>
                        <div style=${this.text ? "display: block" : "display: none"} class="q-spin-text">${this.text}</div>
                    </div>
                </div>
                <slot class=${classMap({"q-spin-container": true,"q-spin-blur": this.loading}) }></slot>
            </div>

        `;
    }


}

declare global {
    interface HTMLElementTagNameMap {
        "q-spin": "QSpin";
    }
}
