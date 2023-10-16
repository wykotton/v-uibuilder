import { css, html, unsafeCSS } from "lit";
import { property, query, queryAll } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { customHasElement } from "../../types/runtime/decorators/decorators";
import { parseToHSVA } from "../../util/color/color.js";
import { HSVaColor } from "../../util/color/hsvacolor.js";
import { DOMEmit } from "../../util/reactivity/Emit";
import cssIndex from "./index.scss?inline";

const Material_colors = [
  "#f44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFEB3B",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#795548",
  "#9E9E9E",
  "#607D8B",
  "rgba(0,0,0,.65)",
  "transparent",
  "#FFFFFF",
];

@customHasElement("q-color-panel")
export class QColorPanel extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  @property({ type: String, reflect: true })
  public value = "";

  // 整个颜色选择器
  @query("#color-pane")
  public panel!: HTMLElement;

  // 颜色拖动选择区域
  @query("#color-palette")
  public palette!: HTMLElement;

  // 预设颜色按钮区域
  @query("#colors")
  public colors!: HTMLElement;

  // 颜色滑块
  @query("#range-hue")
  public rangeHue!: HTMLInputElement;

  // 透明度滑块
  @query("#range-opacity")
  public rangeOpacity!: HTMLInputElement;

  // 圆形颜色按钮的input
  @query("#copy-btn input")
  public copyInfo!: HTMLInputElement;

  // Hexa颜色所有input
  @queryAll("#color-hexa input")
  public colorHexa!: HTMLInputElement[];

  // rgba颜色所有input
  @queryAll("#color-rgba input")
  public colorRgba!: HTMLInputElement[];

  // Hlsa颜色所有input
  @queryAll("#color-hlsa input")
  public colorHlsa!: HTMLInputElement[];

  public defaultValue = "#FF0000";
  // 颜色数据
  public colorValue = <any>[];
  // 内|部临时颜色值
  public tempValue = "";
  public type = ["HEXA", "RGBA", "HSLA"];
  public typeIndex = 0;
  // 整个选择器被更改
  public nativeClick = false;
  // 拖动开始
  public start = false;

  // 颜色数据格式化，实时同步各个部分显示数据
  public formatColor() {
    this.colorValue = parseToHSVA(this.tempValue).values;
    //[h,s,v,a]
    const [h, s, v, a = 1] = this.colorValue;
    this.panel.style.setProperty("--h", h);
    this.panel.style.setProperty("--s", s);
    this.panel.style.setProperty("--v", v);
    this.panel.style.setProperty("--a", a);
    this.panel.style.setProperty("--c", this.getValue());
    this.copyInfo.value = this.getValue();
    this.rangeHue.value = h;
    this.rangeOpacity.value = a.toFixed(2);
    const COLOR = HSVaColor(...this.colorValue);
    this.colorHexa[0].value = COLOR.toHEXA().toString();
    const RGBA = COLOR.toRGBA();
    this.colorRgba[0].value = RGBA[0].toFixed(0);
    this.colorRgba[1].value = RGBA[1].toFixed(0);
    this.colorRgba[2].value = RGBA[2].toFixed(0);
    this.colorRgba[3].value = RGBA[3].toFixed(2);
    const HSLA = COLOR.toHSLA();
    this.colorHlsa[0].value = HSLA[0].toFixed(0);
    this.colorHlsa[1].value = HSLA[1].toFixed(0);
    this.colorHlsa[2].value = HSLA[2].toFixed(0);
    this.colorHlsa[3].value = HSLA[3].toFixed(2);
    if (this.nativeClick) {
      this.nativeClick = false;
      DOMEmit(this, "change", {
        detail: {
          value: this.getValue(),
          colorValue: this.getColor(),
        },
      });
    }
  }

  // 获取格式化后的color
  public getValue() {
    return HSVaColor(...this.colorValue)
      ["to" + this.type[this.typeIndex]]()
      .toString();
  }

  //
  public getColor() {
    return HSVaColor(...this.colorValue);
  }

  // 颜色拖动开始
  public paletteMousedown(ev: MouseEvent) {
    ev.stopPropagation();
    this.start = true;
    this.choose(ev);
  }
  // 添加鼠标移动和抬起监听
  public addMouseEvent() {
    // 把this指向绑定到当前组件实例
    document.addEventListener("mousemove", this.mousemove.bind(this));
    document.addEventListener("mouseup", this.mouseup.bind(this));
  }
  // 移除鼠标移动和抬起监听
  public removeMouseEvent() {
    document.removeEventListener("mousemove", this.mousemove.bind(this));
    document.removeEventListener("mouseup", this.mouseup.bind(this));
  }
  public choose(ev: any) {
    const { x, y, width: w, height: h } = this.palette.getBoundingClientRect();
    const value = [...this.colorValue];
    const _x = Math.min(Math.max(0, ((ev.clientX - x) / w) * 100), 100);
    const _y = Math.min(Math.max(0, ((ev.clientY - y) / h) * 100), 100);
    value[1] = _x;
    value[2] = 100 - _y;
    this.nativeClick = true;
    this.tempValue = `hsva(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;
    this.formatColor();
  }
  public mousemove(ev: MouseEvent) {
    if (this.start) {
      this.choose(ev);
    }
  }
  public mouseup() {
    this.start = false;
  }

  // 颜色选择滑块change
  public rangeHueInput() {
    const value = [...this.colorValue];
    value[0] = Number(this.rangeHue.value);
    this.nativeClick = true;
    this.tempValue = `hsva(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;
    this.formatColor();
  }

  // 透明度选择滑块change
  public rangeOpacityInput() {
    const value = [...this.colorValue];
    value[3] = Number(this.rangeOpacity.value);
    this.nativeClick = true;
    this.tempValue = `hsva(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;
    this.formatColor();
  }

  // 预设颜色按钮区域click
  public colorsClick(ev: any) {
    ev.stopPropagation();
    const item = ev.target.closest("button");
    if (item) {
      this.nativeClick = true;
      this.tempValue = item.dataset.color;
      this.formatColor();
    }
  }

  // 颜色类型切换
  public switchClick(ev: any) {
    ev.stopPropagation();
    this.typeIndex++;
    this.typeIndex %= 3;
    ev.target.textContent = this.type[this.typeIndex];
    this.nativeClick = true;
    this.formatColor();
    ev.target.parentNode.dataset.type = this.type[this.typeIndex];
  }

  // 复制颜色
  public copyBtnClick(e: any) {
    e.stopPropagation();
    navigator.clipboard.writeText(this.copyInfo.value).then(() => {
      console.log("已复制: " + this.copyInfo.value);
    });
  }

  // Hexa颜色change
  public colorHexaChange(ev: any) {
    this.nativeClick = true;
    this.tempValue = ev?.composedPath?.()[0]?.value;
    this.formatColor();
  }

  // Rgba颜色change
  public colorRgbaChange(ev: any, index: number) {
    let inputValue = Number(ev?.composedPath?.()[0]?.value);
    Number.isNaN(inputValue) ? (inputValue = 0) : void 0;
    inputValue < 0 ? (inputValue = 0) : void 0;
    // 检查输入的number是否正确
    switch (index) {
      case 0:
      case 1:
      case 2:
        inputValue > 255 ? (inputValue = 255) : void 0;
        inputValue = Math.floor(inputValue);
        break;
      default:
        inputValue > 1 ? (inputValue = 1) : void 0;
        inputValue = Number(inputValue.toFixed(2));
        break;
    }
    const value = HSVaColor(...this.colorValue).toRGBA();
    value[index] = Number(inputValue);
    this.nativeClick = true;
    this.tempValue = `rgba(${value[0]}, ${value[1]}, ${value[2]}, ${value[3]})`;
    this.formatColor();
  }

  // Hlsa颜色change
  public colorHlsaChange(ev: any, index: number) {
    let inputValue = Number(ev?.composedPath?.()[0].value);
    Number.isNaN(inputValue) ? (inputValue = 0) : void 0;
    inputValue < 0 ? (inputValue = 0) : void 0;
    // 检查输入的number是否正确
    switch (index) {
      case 0:
        inputValue > 360 ? (inputValue = 360) : void 0;
        inputValue = Math.floor(inputValue);
        break;
      case 1:
      case 2:
        inputValue > 100 ? (inputValue = 100) : void 0;
        inputValue = Math.floor(inputValue);
        break;
      default:
        inputValue > 1 ? (inputValue = 1) : void 0;
        inputValue = Number(inputValue.toFixed(2));
        break;
    }
    const value = HSVaColor(...this.colorValue).toHSLA();
    value[index] = Number(inputValue);
    this.nativeClick = true;
    this.tempValue = `hsla(${value[0]}, ${value[1]}%, ${value[2]}%, ${value[3]})`;
    this.formatColor();
  }

  // 组件初始化
  public init() {
    if (
      this.panel &&
      this.copyInfo &&
      this.rangeHue &&
      this.rangeOpacity &&
      this.colorHexa.length &&
      this.colorRgba.length &&
      this.colorHlsa.length
    ) {
      if (this.value) {
        this.tempValue = this.value;
      } else {
        this.tempValue = this.defaultValue;
      }
      this.formatColor();
      this.removeMouseEvent();
      this.addMouseEvent();
    } else {
      setTimeout(() => {
        this.init();
      });
    }
  }

  public render() {
    this.init();
    return html`
      <div class="q-color-panel" id="color-pane">
        <div class="color-palette" id="color-palette" @mousedown=${this.paletteMousedown}></div>
        <div class="color-chooser">
          <a class="color-show" id="copy-btn" @click=${this.copyBtnClick}>
            <svg class="icon-file" viewBox="0 0 1024 1024">
              <path
                d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32z"
              ></path>
              <path
                d="M704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"
              ></path>
            </svg>
            <input />
          </a>
          <div class="color-range">
            <input
              class="color-hue"
              value="0"
              min="0"
              max="360"
              type="range"
              id="range-hue"
              @input=${this.rangeHueInput}
            />
            <input
              class="color-opacity"
              value="1"
              min="0"
              max="1"
              step="0.01"
              type="range"
              id="range-opacity"
              @input=${this.rangeOpacityInput}
            />
          </div>
        </div>
        <div class="color-footer" data-type="HEXA">
          <div class="color-input">
            <div class="color-label" id="color-hexa">
              <input spellcheck="false" @change=${this.colorHexaChange} />
            </div>
            <div class="color-label" id="color-rgba">
              <input
                type="number"
                min="0"
                max="255"
                spellcheck="false"
                @change=${(ev: any) => {
                  this.colorRgbaChange(ev, 0);
                }}
              />
              <input
                type="number"
                min="0"
                max="255"
                spellcheck="false"
                @change=${(ev: any) => {
                  this.colorRgbaChange(ev, 1);
                }}
              />
              <input
                type="number"
                min="0"
                max="255"
                spellcheck="false"
                @change=${(ev: any) => {
                  this.colorRgbaChange(ev, 2);
                }}
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                spellcheck="false"
                @change=${(ev: any) => {
                  this.colorRgbaChange(ev, 3);
                }}
              />
            </div>
            <div class="color-label" id="color-hlsa">
              <input
                type="number"
                min="0"
                max="360"
                spellcheck="false"
                @change=${(ev: any) => {
                  this.colorHlsaChange(ev, 0);
                }}
              />
              <input
                type="number"
                min="0"
                max="100"
                spellcheck="false"
                @change=${(ev: any) => {
                  this.colorHlsaChange(ev, 1);
                }}
              />
              <input
                type="number"
                min="0"
                max="100"
                spellcheck="false"
                @change=${(ev: any) => {
                  this.colorHlsaChange(ev, 2);
                }}
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                spellcheck="false"
                @change=${(ev: any) => {
                  this.colorHlsaChange(ev, 3);
                }}
              />
            </div>
          </div>
          <button class="btn-switch" id="btn-switch" type="flat" @click=${this.switchClick}>HEXA</button>
        </div>
        <div class="color-sign" id="colors" @click=${this.colorsClick}>
          ${Material_colors.map((el: string) => {
            return html`
              <button style="background-color: ${el}; outline: 1px solid #9E9E9E" data-color="${el}"></button>
            `;
          })}
        </div>
      </div>
    `;
  }

  disconnectedCallback() {
    // 移除document的鼠标监听事件
    this.removeMouseEvent();
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-color-panel": QColorPanel;
  }
}
