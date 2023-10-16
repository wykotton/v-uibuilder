import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { Component } from "../../types/runtime/Component";
import cssIndex from "./index.scss?inline";

@customElement("q-page-sider")
export class QPageSider extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  @property({ type: Boolean, attribute: "show" })
  public show = false;

  @property({ type: Number })
  public width = 500;

  @property({ type: Number })
  public height = 780;

  public handleClick(e: any) {
    this.show = !this.show;
  }

  @property({ type: Boolean })
  public fit = false;

  @property({ type: Boolean, attribute: "iconShow" })
  public iconShow = false;

  @property({ type: String, attribute: "background" })
  public background = "#ffffff";

  @property({ type: String, attribute: "margin" })
  public margin = "0 0 0 20px";

  public handleFit() {
    this.fit = !this.fit;
    if (this.fit) {
      this.childNodeList.map((item: any) => {
        item.style.color = "red";
      });
    } else {
      this.childNodeList.map((item: any) => {
        item.style.color = "rgb(0, 0, 0)";
      });
    }
  }

  public handleClose(e: any) {
    this.show = !this.show;
  }

  public childNodeList = [];
  public handleSlotchange(e: any) {
    const childNodes = e.target.assignedNodes({ flatten: true });
    this.childNodeList = childNodes;
  }

  public handleIconSlotchange(e: any) {
    // const childNodes = e.target.assignedNodes({ flatten: true });

    // childNodes.map((item: any) => {
    //   item.addEventListener("mouseover", () => {
    //     this.style.color = "rgba(32,118,212,1)";
    //     this.style.cursor = "pointer";
    //   });
    //   item.addEventListener("mouseleave", () => {
    //     this.style.color = "#000";
    //   });
    // });
  }

  public render() {
    const contentStyle = {
      display: this.show ? "block" : "none",
      boxShadow: "rgb(204 204 204) 5px 5px 8px -3px",
      width: this.width + "px",
      height: this.height + "px",
      left: this.iconShow ? "46px" : "0",
      background: this.background,
      margin: this.margin,
    };
    console.log("this.show", this.show);
    return html`
      <div class="sidebar">
        <div
          class="icon"
          @click=${this.handleClick}
          style="display:${this.iconShow ? "block" : "none"}"
        >
          <slot name="icon" @slotchange=${this.handleIconSlotchange}></slot>
        </div>
        <div class="content" style=${styleMap(contentStyle)}>
          <div class="header">
            <div class="title">
              <slot name="title"></slot>
            </div>
            <div
              class="close"
              style="cursor:pointer"
              @click=${this.handleClose}
            >
              <slot name="close"></slot>
            </div>
            <!-- <div @click="${this
              .handleFit}" class="fit" style="cursor:pointer;">
              <slot name="fit" @slotchange=${this.handleSlotchange}></slot>
            </div> -->
          </div>
          <div class="section">
            <slot name="section"></slot>
          </div>
          <div class="footer"><slot name="footer"></slot></div>
        </div>
      </div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "q-page-sider": QPageSider;
  }
}
