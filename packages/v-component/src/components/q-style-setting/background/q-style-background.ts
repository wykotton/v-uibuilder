import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { Component } from "../../../types/runtime/Component";
import { DOMEmit } from "../../../util/reactivity/Emit";
import { booleanTransform, openFileSelector } from "../../../util/utils";
import { isEqual, isString } from "lodash-es";
import cssIndex from "./index.scss?inline";
import { QColorPicker } from "../../q-color-picker/q-color-picker";
import "../../q-color-picker/q-color-picker";
import "../../q-radio-group/q-radio-group";
import { QInput } from "../../q-input/q-input";
import "../../q-input/q-input";
import { QSelect } from "../../q-select/q-select";
import "../../q-select/q-select";

@customElement("q-style-background")
export class QStyleBackground extends Component {
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

  // 背景类型(color|image)
  @property({ type: String })
  public backgroundType = "";

  // style对象
  @property({
    type: Object,
    hasChanged(newVal: string, oldVal: string) {
      return !isEqual(newVal, oldVal);
    },
  })
  public styleobj = {};

  // 颜色选择器
  @query("q-color-picker")
  public colorPicker!: QColorPicker;

  // 背景图输入框
  @query("q-input")
  public bgInput!: QInput;

  // 背景大小下拉选择框
  @query("q-select")
  public bgSelect!: QSelect;

  // 临时存储对象，用于抛出更改的数据
  public tempObj = {};

  // 组件状态，内|部操作还是外部更新
  public insideChange = false;

  public backgroundArr = [
    { label: "颜色", value: "color" },
    { label: "图片", value: "image" },
  ];

  public backSizeArr = [
    { label: "全部铺满", value: "100% 100%" },
    { label: "等比缩小平铺", value: "cover" },
    { label: "等比放大平铺", value: "contain" },
  ];

  public typeChange(ev: CustomEvent) {
    this.insideChange = true;
    this.backgroundType = ev.detail.value;
  }

  // 解析图片url
  public getBackgroundUrl(image: string) {
    if (!image) return "";
    const regBackgroundUrl = /url\("?'?.*"?'?\)/g;
    const regReplace = /"|'|url|\(|\)/g;
    return (image as any).match(regBackgroundUrl)[0].replace(regReplace, "");
  }

  // 设置子组件初始值
  public setValue(type: string) {
    if (type === "background-image") {
      return this.getBackgroundUrl(this.styleobj[type]);
    }
    return this.styleobj[type];
  }

  // 抛出change自定义事件,删除同类冲突属性
  public emitChange = (arr: Array<string>) => {
    DOMEmit(this, "change", { detail: { value: this.tempObj, delete: arr } });
  };

  // 子组件change事件，变更style
  public valueChange(type: string, value: any) {
    const tempValue = value.replace(/[\r\n]/g, "");
    if (type === "background-image") {
      (this.tempObj as any)[type] = `url('${tempValue}')`;
      (this.styleobj as any)[type] = `url('${tempValue}')`;
      Reflect.deleteProperty(this.tempObj, "background-color");
      Reflect.deleteProperty(this.styleobj, "background-color");
      this.emitChange(["background-color"]);
    } else {
      (this.tempObj as any)[type] = tempValue;
      (this.styleobj as any)[type] = tempValue;
      if (type === "background-color") {
        Reflect.deleteProperty(this.tempObj, "background-image");
        Reflect.deleteProperty(this.tempObj, "background-size");
        Reflect.deleteProperty(this.styleobj, "background-image");
        Reflect.deleteProperty(this.styleobj, "background-size");
        this.emitChange(["background-image", "background-size"]);
      } else {
        this.emitChange([]);
      }
    }
    this.insideChange = true;
    this.requestUpdate();
  }

  public openUploadWin(e: Event) {
    openFileSelector("styleSettingBgOpenWin", {
      selected: (val: string) => {
        const dom = this?.shadowRoot?.querySelector("#picselector") as HTMLElement;
        if (dom) {
          DOMEmit(dom, "onChange", { detail: { value: val } });
          // dom.dispatchEvent(new CustomEvent("onChange", {"detail":{"value":val}}));
        }
      },
    });
  }

  // 初始化数据
  public init() {
    try {
      if (isString(this.styleobj)) {
        this.styleobj = JSON.parse(this.styleobj);
      }
    } catch (error) {}
    if (this.insideChange) {
      this.insideChange = false;
      return;
    }
    this.tempObj = {};
    if (this.styleobj["background-color"]) {
      this.backgroundType = "color";
      this.colorPicker && this.colorPicker.value !== this.styleobj["background-color"]
        ? (this.colorPicker.value = this.setValue("background-color"))
        : void 0;
    } else if (this.styleobj["background-image"]) {
      this.backgroundType = "image";
      this.bgInput && this.bgInput.value !== this.styleobj["background-image"]
        ? (this.bgInput.value = this.setValue("background-image"))
        : void 0;
    } else if (this.styleobj["background-size"]) {
      this.backgroundType = "image";
      this.styleobj["background-size"] && this.bgSelect && this.bgSelect.value !== this.styleobj["background-size"]
        ? (this.bgSelect.value = this.setValue("background-size"))
        : void 0;
    } else {
      this.colorPicker ? (this.colorPicker.value = "") : void 0;
      this.bgInput ? (this.bgInput.value = "") : void 0;
      this.bgSelect ? (this.bgSelect.value = "") : void 0;
      // 外部更改时，没有背景数据就重置背景类型
      this.backgroundType = "";
    }
  }

  public render() {
    this.init();
    return html`
      <div class="q-style-layout">
        <div class="row-container">
          <div class="row-item">
            <span class="row-item-title">背景类型</span>
            <q-radio-group
              class="row-item-content"
              value=${this.backgroundType}
              options=${JSON.stringify(this.backgroundArr)}
              @change=${this.typeChange}
              style="flex: 1;width:0;height: 18px"
            ></q-radio-group>
          </div>
        </div>
        ${this.backgroundType === "color"
          ? html`
              <div class="row-container">
                <div class="row-item">
                  <span class="row-item-title"></span>
                  <q-color-picker
                    class="row-item-content"
                    value=${this.setValue("background-color")}
                    @change=${(e: any) => {
                      this.valueChange("background-color", e.detail.value);
                    }}
                    style="flex: 1;width:0;height: 100%"
                  ></q-color-picker>
                </div>
              </div>
            `
          : null}
        ${this.backgroundType === "image"
          ? html`
              <div class="row-container" style="height: auto;">
                <div class="row-item">
                  <span class="row-item-title"></span>
                  <q-input
                    id="picselector"
                    class="row-item-content"
                    placeholder="请输入图片url"
                    type="textarea"
                    size="medium"
                    value=${this.setValue("background-image")}
                    @onChange=${(e: any) => {
                      this.valueChange("background-image", e.detail.value);
                    }}
                    style="flex: 1;width:0;height: 100%"
                  ></q-input>
                  <q-button
                    @click=${(e: Event) => {
                      this.openUploadWin(e);
                    }}
                  >
                    上传
                  </q-button>
                </div>
              </div>
              <div class="row-container">
                <div class="row-item">
                  <span class="row-item-title"></span>
                  <q-select
                    class="row-item-content"
                    placeholder="背景大小"
                    options=${JSON.stringify(this.backSizeArr)}
                    value=${this.setValue("background-size")}
                    @onChange=${(e: any) => {
                      this.valueChange("background-size", e.detail.value);
                    }}
                    style="flex: 1;width:0;height: 100%"
                  ></q-select>
                </div>
              </div>
            `
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-style-background": QStyleBackground;
  }
}
