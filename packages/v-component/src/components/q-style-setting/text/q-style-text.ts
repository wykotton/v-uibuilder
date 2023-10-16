import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Component } from "../../../types/runtime/Component";
import { DOMEmit } from "../../../util/reactivity/Emit";
import { booleanTransform } from "../../../util/utils";
import { cloneDeep, isEqual, isString } from "lodash-es";
import cssIndex from "./index.scss?inline";
import "../../q-input-number/q-input-number";
import "../../q-select/q-select";
import "../../q-color-picker/q-color-picker";
import "../../q-radio-group/q-radio-group";
import "../../q-slider/q-slider";

@customElement("q-style-text")
export class QStyleText extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public disabled = false;

  @property({
    type: Object,
    hasChanged(newVal: string, oldVal: string) {
      return !isEqual(newVal, oldVal);
    },
  })
  public styleobj = {};

  // 临时存储对象，用于抛出更改的数据
  public tempObj = {};

  // 组件状态，内|部操作还是外部更新
  public insideChange = false;

  public fontWeightArr = [
    {
      label: "100 Thin",
      value: "100",
    },
    {
      label: "200 Extra Light",
      value: "200",
    },
    {
      label: "300 Light",
      value: "300",
    },
    {
      label: "400 Normal",
      value: "400",
    },
    {
      label: "500 Medium",
      value: "500",
    },
    {
      label: "600 Semi Bold",
      value: "600",
    },
    {
      label: "700 Bold",
      value: "700",
    },
    {
      label: "800 Extra Bold",
      value: "800",
    },
    {
      label: "900 Black",
      value: "900",
    },
  ];

  public textAlignArr = [
    {
      label: "左",
      value: "left",
    },
    {
      label: "居中",
      value: "center",
    },
    {
      label: "右",
      value: "right",
    },
    {
      label: "两端",
      value: "justify",
    },
  ];

  // 改变透明度
  public opacityChange(ev: CustomEvent) {
    (this.styleobj as any).opacity = (ev.detail.value / 100).toFixed(2);
    (this.tempObj as any).opacity = (ev.detail.value / 100).toFixed(2);
    this.styleobj = cloneDeep(this.styleobj);
    // 抛出change自定义事件
    DOMEmit(this, "change", { detail: { value: this.tempObj } });
    this.insideChange = true;
    this.requestUpdate();
  }

  // 子组件change事件，变更style
  public valueChange(type: string, value: any) {
    if (type === "font-size" || type === "line-height" || type === "letter-spacing") {
      (this.tempObj as any)[type] = value + "px";
      this.styleobj[type] = value + "px";
    } else {
      (this.tempObj as any)[type] = value;
      this.styleobj[type] = value;
    }
    // 抛出change自定义事件
    DOMEmit(this, "change", { detail: { value: this.tempObj } });
    this.insideChange = true;
    this.requestUpdate();
  }

  // 处理style样式单位
  public replaceUnit(str: string) {
    const tempValue = str.replace("px", "").replace("%", "");
    return tempValue;
  }

  // 设置子组件初始值
  public setValue(type: string) {
    const value = this.styleobj[type] ? this.replaceUnit(this.styleobj[type]) : "";
    if (type === "opacity") {
      const opacity = value ? (Number(value) * 100).toFixed(0) : "100";
      return opacity;
    }
    return value;
  }

  // 数据初始化
  public init() {
    try {
      if (isString(this.styleobj)) {
        this.styleobj = JSON.parse(this.styleobj);
      }
    } catch (error) {}
    if (this.insideChange) {
      this.insideChange = false;
    } else {
      this.tempObj = {};
    }
  }

  public render() {
    this.init();
    return html`
      <div class="q-style-layout">
        <div class="inner-row-container">
          <div class="row-item">
            <span class="row-item-title">字号</span>
            <q-input-number
              class="next-number-picker"
              min="0"
              value=${this.setValue("font-size")}
              @change=${(e: CustomEvent) => {
                this.valueChange("font-size", e.detail.value);
              }}
              style="flex: 1;width:0;height: 100%"
            ></q-input-number>
            <span class="next-input-inner">px</span>
          </div>
          <div style="width: 12px"></div>
          <div class="row-item">
            <span class="row-item-title">行高</span>
            <q-input-number
              class="next-number-picker"
              min="0"
              value=${this.setValue("line-height")}
              @change=${(e: CustomEvent) => {
                this.valueChange("line-height", e.detail.value);
              }}
              style="flex: 1;width:0;height: 100%"
            ></q-input-number>
            <span class="next-input-inner">px</span>
          </div>
        </div>
        <div class="row-container">
          <div class="row-item">
            <span class="row-item-title">字体粗细</span>
            <q-select
              class="row-item-content"
              options=${JSON.stringify(this.fontWeightArr)}
              placeholder="请选择"
              value=${this.setValue("font-weight")}
              @onChange=${(e: CustomEvent) => {
                this.valueChange("font-weight", e.detail.value);
              }}
              style="flex: 1;width:0;height: 100%"
            ></q-select>
          </div>
        </div>
        <div class="row-container">
          <div class="row-item">
            <span class="row-item-title">文字间距</span>
            <q-input-number
              class="row-item-content"
              min="0"
              max="30"
              value=${this.setValue("letter-spacing")}
              @change=${(e: CustomEvent) => {
                this.valueChange("letter-spacing", e.detail.value);
              }}
              style="flex: 1;width:0;height: 100%"
            ></q-input-number>
          </div>
        </div>
        <div class="row-container">
          <div class="row-item">
            <span class="row-item-title">字体颜色</span>
            <q-color-picker
              class="row-item-content"
              value=${this.setValue("color")}
              @change=${(e: CustomEvent) => {
                this.valueChange("color", e.detail.value);
              }}
              style="flex: 1;width:0;height: 100%"
            ></q-color-picker>
          </div>
        </div>
        <div class="row-container">
          <div class="row-item">
            <span class="row-item-title">对齐方式</span>
            <q-radio-group
              class="row-item-content"
              options=${JSON.stringify(this.textAlignArr)}
              value=${this.setValue("text-align")}
              @change=${(e: CustomEvent) => {
                this.valueChange("text-align", e.detail.value);
              }}
              style="flex: 1;width:0;height: 18px"
            ></q-radio-group>
          </div>
        </div>
        <div class="row-container">
          <div class="row-item">
            <span class="row-item-title">透明度</span>
            <q-slider
              class="row-item-content"
              value=${this.setValue("opacity")}
              @change=${this.opacityChange}
              style="flex: 1;width:0;height: 100%"
            ></q-slider>
            <span style="width: 16px"></span>
            <q-input-number
              style="width: 80px;height:100%"
              min="0"
              max="100"
              precision="0"
              value=${this.setValue("opacity")}
              @change=${this.opacityChange}
            ></q-input-number>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-style-text": QStyleText;
  }
}
