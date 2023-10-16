import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Component } from "../../../types/runtime/Component";
import { DOMEmit } from "../../../util/reactivity/Emit";
import { booleanTransform } from "../../../util/utils";
import { isEqual, isString } from "lodash-es";
import cssIndex from "./index.scss?inline";
import "../../q-select/q-select";
import "../../q-input-number/q-input-number";

@customElement("q-style-position")
export class QStylePosition extends Component {
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

  // style对象
  @property({
    type: Object,
    hasChanged(newVal: string, oldVal: string) {
      return !isEqual(newVal, oldVal);
    },
  })
  public styleobj = {};

  // 页面布局
  @property({ type: String })
  public percentorabsolute = "absolute";

  // 临时存储对象，用于抛出更改的数据
  public tempObj = {};

  // 组件状态，内|部操作还是外部更新
  public insideChange = false;

  public leftUnit = "";
  public topUnit = "";

  private unitType = {
    absolute: "absolute",
    percent: "percent",
  };

  // 子组件change事件，变更style
  public valueChange(type: string, value: Number) {
    try {
      if (type === "left") {
        (this.tempObj as any)[type] = value + (this.leftUnit === this.unitType.absolute ? "px" : "%");
        (this.styleobj as any)[type] = value + (this.leftUnit === this.unitType.absolute ? "px" : "%");
      } else if (type === "top") {
        (this.tempObj as any)[type] = value + (this.topUnit === this.unitType.absolute ? "px" : "%");
        (this.styleobj as any)[type] = value + (this.topUnit === this.unitType.absolute ? "px" : "%");
      } else {
        (this.tempObj as any)[type] = value;
        (this.styleobj as any)[type] = value;
      }
      // 抛出change自定义事件
      DOMEmit(this, "change", { detail: { value: this.tempObj } });
      this.insideChange = true;
      this.requestUpdate();
    } catch (error) {
      console.log(error);
    }
  }

  // 处理style样式单位
  public replaceUnit(str: string, type: string) {
    if (typeof str === "string") {
      const tempValue = str.replace("px", "").replace("%", "");
      let unit = "";
      if (str.indexOf("px") !== -1) unit = this.unitType.absolute;
      if (str.indexOf("%") !== -1) unit = this.unitType.percent;
      switch (type) {
        case "left":
          this.leftUnit = unit;
          break;
        case "top":
          this.topUnit = unit;
          break;
      }
      return tempValue;
    } else {
      return str;
    }
  }

  // 设置子组件初始值
  public setValue(type: string) {
    try {
      const value = this.styleobj[type] ? this.replaceUnit(this.styleobj[type], type) : "";
      return value;
    } catch (error) {
      return "";
    }
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
            <span class="row-item-title">X轴</span>
            <q-input-number
              class="next-number-picker"
              value=${this.setValue("left")}
              min="0"
              max=${this.leftUnit === this.unitType.percent ? "100" : "Infinity"}
              precision="3"
              @change=${(e: CustomEvent) => {
                this.valueChange("left", e.detail.value);
              }}
              style="flex: 1;width:0;height: 100%"
            ></q-input-number>
            <span class="next-input-inner">${this.leftUnit === this.unitType.absolute ? "px" : "%"}</span>
          </div>
          <div style="width: 12px"></div>
          <div class="row-item">
            <span class="row-item-title">Y轴</span>
            <q-input-number
              class="next-number-picker"
              value=${this.setValue("top")}
              min="0"
              max=${this.topUnit === this.unitType.percent ? "100" : "Infinity"}
              precision="3"
              @change=${(e: CustomEvent) => {
                this.valueChange("top", e.detail.value);
              }}
              style="flex: 1;width:0;height: 100%"
            ></q-input-number>
            <span class="next-input-inner">${this.topUnit === this.unitType.absolute ? "px" : "%"}</span>
          </div>
        </div>
        <div class="row-container">
          <div class="row-item">
            <span class="row-item-title">层叠顺序</span>
            <q-input-number
              class="row-item-content"
              min="0"
              max="Infinity"
              value=${this.setValue("z-index")}
              @change=${(e: CustomEvent) => {
                this.valueChange("z-index", e.detail.value);
              }}
              style="flex: 1;width:0;height: 100%"
            ></q-input-number>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-style-position": QStylePosition;
  }
}
