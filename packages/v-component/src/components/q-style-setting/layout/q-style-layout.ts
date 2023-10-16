import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { Component } from "../../../types/runtime/Component";
import { DOMEmit } from "../../../util/reactivity/Emit";
import { booleanTransform } from "../../../util/utils";
import { cssToJs } from "../../../util/utils";
import { isEqual, isString } from "lodash-es";
import cssIndex from "./index.scss?inline";
import "../../q-input-number/q-input-number";

@customElement("q-style-layout")
export class QStyleLayout extends Component {
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

  @property({ type: String })
  public percentorabsolute = "absolute";

  // 临时存储对象，用于抛出更改的数据
  public tempObj = {};

  // 组件状态，内|部操作还是外部更新
  public insideChange = false;

  public widthUnit = "";
  public heightUnit = "";

  private unitType = {
    absolute: "absolute",
    percent: "percent",
  };

  // input输入框实例
  @query(".margin-top-div input")
  public marginTopInput!: HTMLInputElement;
  @query(".margin-bottom-div input")
  public marginBottomInput!: HTMLInputElement;
  @query(".margin-left-div input")
  public marginLeftInput!: HTMLInputElement;
  @query(".margin-right-div input")
  public marginRightInput!: HTMLInputElement;
  @query(".padding-top-div input")
  public paddingTopInput!: HTMLInputElement;
  @query(".padding-bottom-div input")
  public paddingBottomInput!: HTMLInputElement;
  @query(".padding-left-div input")
  public paddingLeftInput!: HTMLInputElement;
  @query(".padding-right-div input")
  public paddingRightInput!: HTMLInputElement;

  // 子组件change事件，变更style
  public valueChange(type: string, value: Number) {
    if (type === "width") {
      if (this.widthUnit === this.unitType.absolute) {
        this.tempObj[type] = this.styleobj[type] = value + "px";
      } else if (this.widthUnit === this.unitType.percent) {
        this.tempObj[type] = this.styleobj[type] = value + "%";
      }
    } else if (type === "height") {
      if (this.heightUnit === this.unitType.absolute) {
        this.tempObj[type] = this.styleobj[type] = value + "px";
      } else if (this.heightUnit === this.unitType.percent) {
        this.tempObj[type] = this.styleobj[type] = value + "%";
      }
    } else {
      const exampleName = cssToJs(type) + "Input";
      // margin和padding最多三位数
      if (this[exampleName].value.length > 3) {
        this[exampleName].value = this[exampleName].value.slice(0, 3);
      }
      (this.tempObj as any)[type] = this[exampleName].value + "px";
      this.styleobj[type] = this[exampleName].value + "px";
    }
    // 抛出change自定义事件
    DOMEmit(this, "change", { detail: { value: this.tempObj } });
    this.insideChange = true;
    this.requestUpdate();
  }

  // 处理style样式单位
  public replaceUnit(str: string, type: string) {
    const tempValue = str.replace("px", "").replace("%", "");
    let unit = "";
    if (str.indexOf("px") !== -1) unit = this.unitType.absolute;
    if (str.indexOf("%") !== -1) unit = this.unitType.percent;
    switch (type) {
      case "width":
        this.widthUnit = unit;
        break;
      case "height":
        this.heightUnit = unit;
        break;
    }
    return tempValue;
  }

  // 设置子组件初始值
  public setValue(type: string) {
    const value = this.styleobj[type] ? this.replaceUnit(this.styleobj[type], type) : "";
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
      const domArr = [
        "margin-top",
        "margin-bottom",
        "margin-left",
        "margin-right",
        "padding-top",
        "padding-bottom",
        "padding-left",
        "padding-right",
      ];
      domArr.forEach((item) => {
        const exampleName = cssToJs(item) + "Input";
        this[exampleName] ? (this[exampleName].value = this.setValue(item)) : void 0;
      });
    }
  }

  public render() {
    this.init();
    return html`
      <div class="q-style-layout">
        <div class="layout-box-container">
          <div class="margin-top-div">
            <span class="next-input next-medium next-noborder">
              <input
                type="number"
                placeholder="0"
                maxlength="3"
                height="100%"
                autocomplete="off"
                value=${this.setValue("margin-top")}
                @input=${(e: any) => {
                  this.valueChange("margin-top", 0);
                }}
              />
            </span>
          </div>
          <div class="margin-right-div">
            <span class="next-input next-medium next-noborder">
              <input
                type="number"
                placeholder="0"
                maxlength="3"
                height="100%"
                autocomplete="off"
                value=${this.setValue("margin-right")}
                @input=${(e: any) => {
                  this.valueChange("margin-right", 0);
                }}
              />
            </span>
          </div>
          <div class="margin-bottom-div">
            <span class="help-txt">MARGIN</span>
            <span class="next-input next-medium next-noborder">
              <input
                type="number"
                placeholder="0"
                maxlength="3"
                height="100%"
                autocomplete="off"
                value=${this.setValue("margin-bottom")}
                @input=${(e: any) => {
                  this.valueChange("margin-bottom", 0);
                }}
              />
            </span>
          </div>
          <div class="margin-left-div">
            <span class="next-input next-medium next-noborder">
              <input
                type="number"
                placeholder="0"
                maxlength="3"
                height="100%"
                autocomplete="off"
                value=${this.setValue("margin-left")}
                @input=${(e: any) => {
                  this.valueChange("margin-left", 0);
                }}
              />
            </span>
          </div>
          <div class="padding-top-div">
            <span class="next-input next-medium next-noborder">
              <input
                type="number"
                placeholder="0"
                maxlength="3"
                height="100%"
                autocomplete="off"
                value=${this.setValue("padding-top")}
                @input=${(e: any) => {
                  this.valueChange("padding-top", 0);
                }}
              />
            </span>
          </div>
          <div class="padding-right-div">
            <span class="next-input next-medium next-noborder">
              <input
                type="number"
                placeholder="0"
                maxlength="3"
                height="100%"
                autocomplete="off"
                value=${this.setValue("padding-right")}
                @input=${(e: any) => {
                  this.valueChange("padding-right", 0);
                }}
              />
            </span>
          </div>
          <div class="padding-bottom-div">
            <span class="help-txt">PADDING</span>
            <span class="next-input next-medium next-noborder">
              <input
                type="number"
                placeholder="0"
                maxlength="3"
                height="100%"
                autocomplete="off"
                value=${this.setValue("padding-bottom")}
                @input=${(e: any) => {
                  this.valueChange("padding-bottom", 0);
                }}
              />
            </span>
          </div>
          <div class="padding-left-div">
            <span class="next-input next-medium next-noborder">
              <input
                type="number"
                placeholder="0"
                maxlength="3"
                height="100%"
                autocomplete="off"
                value=${this.setValue("padding-left")}
                @input=${(e: any) => {
                  this.valueChange("padding-left", 0);
                }}
              />
            </span>
          </div>
        </div>
        <div class="inner-row-container">
          <div class="row-item">
            <span class="row-item-title">宽度</span>
            <q-input-number
              class="next-number-picker"
              value=${this.setValue("width")}
              min="0"
              max=${this.widthUnit === this.unitType.percent ? "100" : "Infinity"}
              precision="3"
              @change=${(e: CustomEvent) => {
                this.valueChange("width", e.detail.value);
              }}
              style="flex: 1;width:0;height: 100%"
            ></q-input-number>
            <span class="next-input-inner">
              ${this.widthUnit === this.unitType.absolute ? "px" : ""}
              ${this.widthUnit === this.unitType.percent ? "%" : ""}
            </span>
          </div>
          <div style="width: 12px"></div>
          <div class="row-item">
            <span class="row-item-title">高度</span>
            <q-input-number
              class="next-number-picker"
              value=${this.setValue("height")}
              min="0"
              max=${this.heightUnit === this.unitType.percent ? "100" : "Infinity"}
              precision="3"
              @change=${(e: CustomEvent) => {
                this.valueChange("height", e.detail.value);
              }}
              style="flex: 1;width:0;height: 100%"
            ></q-input-number>
            <span class="next-input-inner">
              ${this.heightUnit === this.unitType.absolute ? "px" : ""}
              ${this.heightUnit === this.unitType.percent ? "%" : ""}
            </span>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-style-layout": QStyleLayout;
  }
}
