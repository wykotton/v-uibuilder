import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import cssIndex from "./index.scss?inline";
import { styleMap } from "lit/directives/style-map.js";
type ShapeEnums = "circle" | "square";
type FitEnums = "fill" | "contain" | "cover" | "none" | "scale-down";

@customElement("q-avatar")
export class QAvatar extends Component {
  constructor() {
    super();
  }
  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  //头像大小
  @property({ type: String, attribute: "size" })
  public size = "48";

  //头像外形
  @property({ type: String })
  public shape: ShapeEnums = "circle";

  // 头像图标
  @property({ type: String })
  public icon = "";

  // 头像链接地址
  @property({ type: String })
  public src = "";

  // 头像提示
  @property({ type: String })
  public alt = "";

  // 头像链接类型
  @property({ type: String })
  public srcSet = "";

  //头像覆盖方式
  @property({ type: String })
  public fit: FitEnums = "cover";

  public isImageExist = true;

  get avatarClass() {
    const classList: string[] = ["q-avatar"];
    if (this.size && typeof this.size === "string") {
      classList.push(`q-avatar-${this.size}`);
    }

    if (this.icon) {
      classList.push("q-avatar-icon");
    }

    if (this.shape) {
      classList.push(`q-avatar-${this.shape}`);
    }

    return classList.join(" ");
  }
  public renderAvatar() {
    if (this.isImageExist && this.src) {
      return html`
        (
        <img src=${this.src} alt=${this.alt} srcset=${this.srcSet} style=${{ "object-fit": this.fit }} />
        )
      `;
    }

    if (this.icon) {
      return html`
        <i class=${this.icon} />
      `;
    }

    return html`
      <slot></slot>
    `;
  }

  public render() {
    const sizeStyle: Record<any, any> =
      typeof this.size === "string"
        ? {
            height: `${this.size}px`,
            width: `${this.size}px`,
            lineHeight: `${this.size}px`,
            display: "inline-block",
          }
        : {};

    return html`
      <span class=${this.avatarClass} style=${styleMap(sizeStyle)}>${this.renderAvatar()}</span>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "q-avatar": QAvatar;
  }
}
