import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { DOMEmit } from "../../util/reactivity/Emit";
import styleParse from "style-to-object";
import cssIndex from "./index.scss?inline";
import "./layout/q-style-layout";
import "./text/q-style-text";
import "./background/q-style-background";
import "./position/q-style-position";
import "./border/q-style-border";

// 内|部变更，不需要重新渲染
const insideChange = new Proxy({ value: false }, {});

/**
 * 文本组件
 *
 */
@customElement("q-style-setting")
export class QStyleSetting extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  @property({
    type: String,
    hasChanged(newVal: string, oldVal: string) {
      if (insideChange.value) {
        insideChange.value = false;
        return insideChange.value;
      }
      return newVal?.toLowerCase() !== oldVal?.toLowerCase();
    },
  })
  public value = "";

  @property({ type: String })
  public percentorabsolute = "absolute";

  @query("#layout-setter")
  public layoutRef!: HTMLElement;
  @query("#text-setter")
  public textRef!: HTMLElement;
  @query("#background-setter")
  public backgroundRef!: HTMLElement;
  @query("#position-setter")
  public positionRef!: HTMLElement;
  @query("#border-setter")
  public borderRef!: HTMLElement;

  // 样式变更
  public styleChange(e: CustomEvent) {
    const tempObj = { ...this.styleObj, ...e.detail.value };
    // 删除某些样式的同类冲突样式，需要删除的样式数据的key由子组件抛出
    if (e.detail.delete && e.detail.delete.length) {
      e.detail.delete.forEach((key: string) => {
        if (tempObj[key]) Reflect.deleteProperty(tempObj, key);
      });
    }
    this.styleObj = tempObj;
    // console.log(this.styleObj);
    let styleStr = "";
    for (const key in tempObj) {
      styleStr += `${key}: ${tempObj[key]};`;
    }
    insideChange.value = true;
    this.value = styleStr;
    DOMEmit(this, "change", { detail: { value: styleStr } });
  }

  // 设置组件styleObj的值
  public setStyleObj() {
    const style = JSON.stringify(this.styleObj ? this.styleObj : {});
    return style;
  }

  // style对象数据
  public styleObj = {};

  public init() {
    ["layoutRef", "textRef", "backgroundRef", "positionRef", "borderRef"].forEach((key: string) => {
      this?.[key]?.styleobj && (this[key].styleobj = this.setStyleObj());
    });
  }

  public render() {
    this.styleObj = styleParse(this.value) ? (styleParse(this.value) as Object) : {};
    this.init();
    return html`
      <div class="container">
        <div class="content">
          <div class="title">布局</div>
          <div class="style-content">
            <q-style-layout
              id="layout-setter"
              style="width: 100%"
              styleobj=${this.setStyleObj()}
              percentorabsolute=${this.percentorabsolute}
              @change=${this.styleChange}
            ></q-style-layout>
          </div>
        </div>
        <div class="content">
          <div class="title">文字</div>
          <div class="style-content">
            <q-style-text
              id="text-setter"
              style="width: 100%"
              styleobj=${this.setStyleObj()}
              percentorabsolute=${this.percentorabsolute}
              @change=${this.styleChange}
            ></q-style-text>
          </div>
        </div>
        <div class="content">
          <div class="title">背景</div>
          <div class="style-content">
            <q-style-background
              id="background-setter"
              style="width: 100%"
              styleObj=${this.setStyleObj()}
              percentorabsolute=${this.percentorabsolute}
              @change=${this.styleChange}
            ></q-style-background>
          </div>
        </div>
        <div class="content">
          <div class="title">位置</div>
          <div class="style-content">
            <q-style-position
              id="position-setter"
              style="width: 100%"
              styleobj=${this.setStyleObj()}
              percentorabsolute=${this.percentorabsolute}
              @change=${this.styleChange}
            ></q-style-position>
          </div>
        </div>
        <div class="content">
          <div class="title">边框</div>
          <div class="style-content">
            <q-style-border
              id="border-setter"
              style="width: 100%"
              styleobj=${this.setStyleObj()}
              percentorabsolute=${this.percentorabsolute}
              @change=${this.styleChange}
            ></q-style-border>
          </div>
        </div>
      </div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "q-style-setting": QStyleSetting;
  }
}
