import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { Component } from "../../../types/runtime/Component";
import { DOMEmit } from "../../../util/reactivity/Emit";
import { booleanTransform } from "../../../util/utils";
import { isEqual, isString } from "lodash-es";
import cssIndex from "./index.scss?inline";
import "../../q-color-picker/q-color-picker";
import "../../q-radio-group/q-radio-group";
import "../../q-input/q-input";

@customElement("q-style-border")
export class QStyleBorder extends Component {
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

  @property({ type: String })
  public radiusType = "";

  @property({ type: String })
  public borderType = "";

  @property({
    type: Object,
    hasChanged(newVal: string, oldVal: string) {
      return !isEqual(newVal, oldVal);
    },
  })
  public styleobj = {};

  @query(".border-type-width")
  public borderTypeWidth!: HTMLElement;

  @query(".border-type-color")
  public borderTypeColor!: HTMLElement;

  @query(".border-type-style")
  public borderTypeStyle!: HTMLElement;

  // 临时存储对象，用于抛出更改的数据
  public tempObj = {};

  // 组件状态，内|部操作还是外部更新
  public insideChange = false;

  public radiusArr = [
    {
      label: "固定圆角",
      value: "fixed",
    },
    {
      label: "分别定义",
      value: "dispersed",
    },
  ];

  public radiusOptionsArr = [
    "border-top-left-radius",
    "border-top-right-radius",
    "border-bottom-right-radius",
    "border-bottom-left-radius",
  ];

  public borderOptionsArr = ["border-bottom", "border-right", "border-top", "border-left", "border"];

  public borderStyleArr = [
    {
      label: "solid 实线",
      value: "solid",
    },
    {
      label: "dashed 虚线",
      value: "dashed",
    },
    {
      label: "dotted 点线",
      value: "dotted",
    },
  ];

  // 圆角定义类型切换
  public radiusTypeChange(ev: CustomEvent) {
    this.insideChange = true;
    this.radiusType = ev.detail.value;
    console.log(this.radiusType);
    this.requestUpdate();
  }

  // 边框定义类型切换
  public borderTypeChange(type: string) {
    this.insideChange = true;
    this.borderType = type;

    // 临时使用实例设置组件value (lit渲染存在value不更新问题)
    const changeValue = () => {
      this.borderTypeWidth.setAttribute("value", this.setValue(`${type}-width`));
      this.borderTypeColor.setAttribute("value", this.setValue(`${type}-color`));
      this.borderTypeStyle.setAttribute("value", this.setValue(`${type}-style`));
    };
    if (this.borderTypeWidth && this.borderTypeColor && this.borderTypeStyle) {
      changeValue();
    } else {
      setTimeout(() => {
        changeValue();
      });
    }
    this.requestUpdate();
  }

  // 抛出change自定义事件,删除同类冲突属性
  public emitChange = (arr: Array<string>) => {
    DOMEmit(this, "change", { detail: { value: this.tempObj, delete: arr } });
  };

  // 删除对象属性
  deleteProperty(obj: Object, arr: Array<string>) {
    arr.forEach((item) => {
      Reflect.deleteProperty(obj, item);
    });
  }

  // 圆角change事件
  public radiusChange(type: string, value: number) {
    (this.tempObj as any)[type] = value + "px";
    (this.styleobj as any)[type] = value + "px";
    if (type === "border-radius") {
      const arr = [
        "border-top-left-radius",
        "border-top-right-radius",
        "border-bottom-right-radius",
        "border-bottom-left-radius",
      ];
      this.deleteProperty(this.tempObj, arr);
      this.deleteProperty(this.styleobj, arr);
      // 不同样式，抛出其冲突样式
      this.emitChange(arr);
    } else {
      const arr = ["border-radius"];
      this.deleteProperty(this.tempObj, arr);
      this.deleteProperty(this.styleobj, arr);
      // 不同样式，抛出其冲突样式
      this.emitChange(arr);
    }
    this.insideChange = true;
    this.requestUpdate();
  }

  // 变更后需要添加单位的css样式
  public formatArr = [
    "border-width",
    "border-top-width",
    "border-right-width",
    "border-bottom-width",
    "border-left-width",
  ];
  // 边框change事件
  public borderChange(type: string, value: any) {
    // 处理单位，width需要添加px
    if (this.formatArr.includes(type)) {
      (this.tempObj as any)[type] = value + "px";
      (this.styleobj as any)[type] = value + "px";
    } else {
      (this.tempObj as any)[type] = value;
      (this.styleobj as any)[type] = value;
    }
    // 不同样式，抛出其冲突样式
    if (type.indexOf("width") !== -1) {
      if (type === "border-width") {
        const arr = ["border-top-width", "border-right-width", "border-bottom-width", "border-left-width"];
        this.deleteProperty(this.tempObj, arr);
        this.deleteProperty(this.styleobj, arr);
        this.emitChange(arr);
      } else {
        const arr = ["border-width"];
        this.deleteProperty(this.tempObj, arr);
        this.deleteProperty(this.styleobj, arr);
        this.emitChange(["border-width"]);
      }
    } else if (type.indexOf("color") !== -1) {
      if (type === "border-color") {
        const arr = ["border-top-color", "border-right-color", "border-bottom-color", "border-left-color"];
        this.deleteProperty(this.tempObj, arr);
        this.deleteProperty(this.styleobj, arr);
        this.emitChange(arr);
      } else {
        const arr = ["border-color"];
        this.deleteProperty(this.tempObj, arr);
        this.deleteProperty(this.styleobj, arr);
        this.emitChange(arr);
      }
    } else {
      if (type === "border-style") {
        const arr = ["border-top-style", "border-right-style", "border-bottom-style", "border-left-style"];
        this.deleteProperty(this.tempObj, arr);
        this.deleteProperty(this.styleobj, arr);
        this.emitChange(arr);
      } else {
        const arr = ["border-style"];
        this.deleteProperty(this.tempObj, arr);
        this.deleteProperty(this.styleobj, arr);
        this.emitChange(arr);
      }
    }
    this.insideChange = true;
    this.requestUpdate();
  }

  // 处理style样式单位
  public replaceUnit(str: string) {
    const tempValue = str.replace("px", "");
    return tempValue;
  }

  // 设置子组件初始值
  public setValue(type: string) {
    const value = this.styleobj[type] ? this.replaceUnit(this.styleobj[type]) : "";
    return value;
  }

  // 解析连写的radius
  public formatRadius() {
    if (!this.styleobj["border-radius"]) return;
    const arr = this.styleobj["border-radius"].split(" ");
    switch (arr.length) {
      case 1:
        this.styleobj["border-top-left-radius"] =
          this.styleobj["border-bottom-right-radius"] =
          this.styleobj["border-top-right-radius"] =
          this.styleobj["border-bottom-left-radius"] =
          this.tempObj["border-top-left-radius"] =
          this.tempObj["border-bottom-right-radius"] =
          this.tempObj["border-top-right-radius"] =
          this.tempObj["border-bottom-left-radius"] =
            arr[0];
        !this.insideChange ? (this.radiusType = "fixed") : void 0;
        break;
      case 2:
        this.styleobj["border-top-left-radius"] =
          this.styleobj["border-bottom-right-radius"] =
          this.tempObj["border-top-left-radius"] =
          this.tempObj["border-bottom-right-radius"] =
            arr[0];
        this.styleobj["border-top-right-radius"] =
          this.styleobj["border-bottom-left-radius"] =
          this.tempObj["border-top-right-radius"] =
          this.tempObj["border-bottom-left-radius"] =
            arr[1];
        !this.insideChange ? (this.radiusType = "dispersed") : void 0;
        break;
      case 3:
        this.styleobj["border-top-left-radius"] = this.tempObj["border-top-left-radius"] = arr[0];
        this.styleobj["border-top-right-radius"] =
          this.styleobj["border-bottom-left-radius"] =
          this.tempObj["border-top-right-radius"] =
          this.tempObj["border-bottom-left-radius"] =
            arr[1];
        this.styleobj["border-bottom-right-radius"] = this.tempObj["border-bottom-right-radius"] = arr[2];
        !this.insideChange ? (this.radiusType = "dispersed") : void 0;
        break;
      case 4:
        this.styleobj["border-top-left-radius"] = this.tempObj["border-top-left-radius"] = arr[0];
        this.styleobj["border-top-right-radius"] = this.tempObj["border-top-right-radius"] = arr[1];
        this.styleobj["border-bottom-right-radius"] = this.tempObj["border-bottom-right-radius"] = arr[2];
        this.styleobj["border-bottom-left-radius"] = this.tempObj["border-bottom-left-radius"] = arr[3];
        !this.insideChange ? (this.radiusType = "dispersed") : void 0;
        break;
      default:
        this.styleobj["border-radius"] = this.tempObj["border-radius"] = "";
    }
  }

  // 解析连写的border
  public formatBorder() {
    if (this.styleobj["border"]) {
      const temp = this.styleobj["border"].split(" ");
      this.styleobj["border-width"] = temp[0];
      this.styleobj["border-style"] = temp[1];
      if (temp.length > 3) {
        const temp2 = temp.slice(2);
        this.styleobj["border-color"] = temp2.join("");
      } else {
        this.styleobj["border-color"] = temp[2];
      }
    }
    const borderArr = ["border-top", "border-bottom", "border-left", "border-right"];
    borderArr.forEach((item) => {
      if (this.styleobj[item]) {
        const temp = this.styleobj[item].split(" ");
        this.styleobj[`${item}-width`] = temp[0];
        this.styleobj[`${item}-style`] = temp[1];
        if (temp.length > 3) {
          const temp2 = temp.slice(2);
          this.styleobj[`${item}-color`] = temp2.join("");
        } else {
          this.styleobj[`${item}-color`] = temp[2];
        }
      }
    });
  }

  // 初始化数据
  public init() {
    try {
      if (isString(this.styleobj)) {
        this.styleobj = JSON.parse(this.styleobj);
      }
    } catch (error) {}
    if (!this.insideChange) {
      this.tempObj = {};
      // 外部更改时，重置圆角和边框选择项
      this.borderType = "";
      this.radiusType = "";
      // 初始化圆角选择类型
      this.radiusOptionsArr.forEach((item) => {
        if (this.styleobj[item]) this.radiusType = "dispersed";
      });
      // 初始化边框选择类型
      this.borderOptionsArr.forEach((item) => {
        if (this.styleobj[item] || this.styleobj[`${item}-width`]) this.borderType = item;
      });
    }
    // 格式化radius样式
    this.formatRadius();
    // 格式化border样式
    this.formatBorder();
    this.insideChange = false;
  }

  public render() {
    this.init();
    return html`
      <div class="q-style-layout">
        <div class="row-container">
          <div class="row-item">
            <span class="row-item-title">圆角</span>
            <q-radio-group
              class="row-item-content"
              value=${this.radiusType}
              options=${JSON.stringify(this.radiusArr)}
              @change=${this.radiusTypeChange}
              style="flex: 1;width:0;height: 18px"
            ></q-radio-group>
          </div>
        </div>
        ${this.radiusType === "fixed"
          ? html`
              <div class="row-container">
                <div class="row-item">
                  <span class="row-item-title"></span>
                  <q-slider
                    class="row-item-content"
                    value=${this.setValue("border-radius")}
                    min="0"
                    max="30"
                    @change=${(e: any) => {
                      this.radiusChange("border-radius", e.detail.value);
                    }}
                    style="flex: 1;width:0;height: 100%"
                  ></q-slider>
                  <span style="width: 16px"></span>
                  <q-input-number
                    style="width: 80px;height:100%"
                    min="0"
                    max="30"
                    value=${this.setValue("border-radius")}
                    @change=${(e: any) => {
                      this.radiusChange("border-radius", e.detail.value);
                    }}
                  ></q-input-number>
                  <span class="next-text-inner">px</span>
                </div>
              </div>
            `
          : null}
        ${this.radiusType === "dispersed"
          ? html`
              <div class="row-container">
                <div class="row-item">
                  <span class="row-item-title"></span>
                  <svg
                    class="row-item-icon"
                    fill="currentColor"
                    color="#959697"
                    width="20px"
                    height="20px"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M656 200h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z m58 624h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM192 650h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m696-696h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m-348 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m-174 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m174-696H358c-127 0-230 103-230 230v182c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V358c0-87.3 70.7-158 158-158h182c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"
                    />
                  </svg>
                  <q-input-number
                    style="width: 80px;height:100%"
                    min="0"
                    max="30"
                    value=${this.setValue("border-top-left-radius")}
                    @change=${(e: any) => {
                      this.radiusChange("border-top-left-radius", e.detail.value);
                    }}
                  ></q-input-number>
                </div>
                <div class="row-item">
                  <span class="row-item-title" style="width: 0px"></span>
                  <svg
                    class="row-item-icon"
                    fill="currentColor"
                    color="#959697"
                    width="20px"
                    height="20px"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M368 128h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m-2 696h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m522-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM192 128h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0 174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m348 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m174 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m-48-696H484c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h182c87.3 0 158 70.7 158 158v182c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V358c0-127-103-230-230-230z"
                    />
                  </svg>
                  <q-input-number
                    style="width: 80px;height:100%"
                    min="0"
                    max="30"
                    value=${this.setValue("border-top-right-radius")}
                    @change=${(e: any) => {
                      this.radiusChange("border-top-right-radius", e.detail.value);
                    }}
                  ></q-input-number>
                </div>
              </div>
              <div class="row-container">
                <div class="row-item">
                  <span class="row-item-title"></span>
                  <svg
                    class="row-item-icon"
                    fill="currentColor"
                    color="#959697"
                    width="20px"
                    height="20px"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M712 824h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m2-696h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM136 374h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z m0-174h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z m752 624h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m-348 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m-230 72h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z m230 624H358c-87.3 0-158-70.7-158-158V484c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v182c0 127 103 230 230 230h182c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"
                    />
                  </svg>
                  <q-input-number
                    style="width: 80px;height:100%"
                    min="0"
                    max="30"
                    value=${this.setValue("border-bottom-left-radius")}
                    @change=${(e: any) => {
                      this.radiusChange("border-bottom-left-radius", e.detail.value);
                    }}
                  ></q-input-number>
                </div>
                <div class="row-item">
                  <span class="row-item-title" style="width: 0px"></span>
                  <svg
                    class="row-item-icon"
                    fill="currentColor"
                    color="#959697"
                    width="20px"
                    height="20px"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M368 824h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m-58-624h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z m578 102h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM192 824h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m0-174h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m292 72h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z m174 0h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z m230 276h-56c-4.4 0-8 3.6-8 8v182c0 87.3-70.7 158-158 158H484c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h182c127 0 230-103 230-230V484c0-4.4-3.6-8-8-8z"
                    />
                  </svg>
                  <q-input-number
                    style="width: 80px;height:100%"
                    min="0"
                    max="30"
                    value=${this.setValue("border-bottom-right-radius")}
                    @change=${(e: any) => {
                      this.radiusChange("border-bottom-right-radius", e.detail.value);
                    }}
                  ></q-input-number>
                </div>
              </div>
            `
          : null}
        <div class="row-container" style="height: 110px">
          <div class="row-item">
            <span class="row-item-title">边框</span>
            <div class="row-item-border">
              <span
                class="row-item-border_icon"
                @click=${(e: any) => {
                  this.borderTypeChange("border-left");
                }}
              >
                <svg
                  class="icon"
                  fill="currentColor"
                  color=${this.borderType === "border-left" ? "#5584FF" : "#959697"}
                  width="20px"
                  height="20px"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M208 144h-56c-4.4 0-8 3.6-8 8v720c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V152c0-4.4-3.6-8-8-8zM374 144h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM872 144h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 144h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM706 144h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 310h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM872 310h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM872 642h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 642h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 476h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM872 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM872 476h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM374 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM374 476h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM706 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM706 476h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"
                  />
                </svg>
              </span>
              <div class="row-item-border-content">
                <span
                  class="row-item-border_icon"
                  @click=${(e: any) => {
                    this.borderTypeChange("border-top");
                  }}
                >
                  <svg
                    class="icon"
                    fill="currentColor"
                    color=${this.borderType === "border-top" ? "#5584FF" : "#959697"}
                    width="20px"
                    height="20px"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M872 144H152c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM208 310h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM208 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM208 476h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM208 642h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM374 476h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM374 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM706 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM706 476h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM872 476h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 476h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM872 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM872 310h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 310h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM872 642h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 642h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"
                    />
                  </svg>
                </span>
                <span
                  class="row-item-border_icon"
                  @click=${(e: any) => {
                    this.borderTypeChange("border");
                  }}
                >
                  <svg
                    class="icon"
                    fill="currentColor"
                    color=${this.borderType === "border" ? "#5584FF" : "#959697"}
                    width="20px"
                    height="20px"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32z m-40 728H184V184h656v656zM484 366h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM302 548h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM666 548h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM484 548h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM484 730h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z"
                    />
                  </svg>
                </span>
                <span
                  class="row-item-border_icon"
                  @click=${(e: any) => {
                    this.borderTypeChange("border-bottom");
                  }}
                >
                  <svg
                    class="icon"
                    fill="currentColor"
                    color=${this.borderType === "border-bottom" ? "#5584FF" : "#959697"}
                    width="20px"
                    height="20px"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M872 808H152c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM152 714h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM152 216h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM152 548h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM152 382h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM318 548h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM318 216h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM650 216h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM650 548h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM872 476h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM484 548h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM872 144h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM484 216h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM872 642h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM484 714h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zM872 310h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM484 382h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z"
                    />
                  </svg>
                </span>
              </div>
              <span
                class="row-item-border_icon"
                @click=${(e: any) => {
                  this.borderTypeChange("border-right");
                }}
              >
                <svg
                  class="icon"
                  fill="currentColor"
                  color=${this.borderType === "border-right" ? "#5584FF" : "#959697"}
                  width="20px"
                  height="20px"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M872 144h-56c-4.4 0-8 3.6-8 8v720c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V152c0-4.4-3.6-8-8-8zM706 144h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM208 144h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 144h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM374 144h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 310h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM208 310h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM208 642h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 642h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 476h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM208 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM208 476h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM706 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM706 476h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM374 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM374 476h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"
                  />
                </svg>
              </span>
            </div>
            ${this.borderType !== ""
              ? html`
                  <div class="row-item-border_content" style="flex-direction: column;">
                    <q-input-number
                      class="border-type-width"
                      style="width: 100%;height:28px"
                      min="0"
                      max="30"
                      value=${this.setValue(`${this.borderType}-width`)}
                      @change=${(e: any) => {
                        this.borderChange(`${this.borderType}-width`, e.detail.value);
                      }}
                    ></q-input-number>
                    <q-color-picker
                      class="border-type-color"
                      style="width: 100%;height:28px;margin-top:10px"
                      value=${this.setValue(`${this.borderType}-color`)}
                      @change=${(e: CustomEvent) => {
                        this.borderChange(`${this.borderType}-color`, e.detail.value);
                      }}
                    ></q-color-picker>
                    <q-select
                      class="border-type-style"
                      style="width: 100%;height:28px;margin-top:10px"
                      placeholder="边框线条"
                      options=${JSON.stringify(this.borderStyleArr)}
                      value=${this.setValue(`${this.borderType}-style`)}
                      @onChange=${(e: CustomEvent) => {
                        this.borderChange(`${this.borderType}-style`, e.detail.value);
                      }}
                    ></q-select>
                  </div>
                `
              : null}
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-style-border": QStyleBorder;
  }
}
