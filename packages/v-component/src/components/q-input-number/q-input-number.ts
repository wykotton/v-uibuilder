import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { extractClass } from "../../common";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform, sendFormMsg } from "../../util/utils";
import cssIndex from "./index.scss?inline";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { cloneDeep, isEqual, isNaN } from "lodash-es";
import { IMessage } from "../../types/runtime/IMessage";

@customElement("q-input-number")
export class QInputNumber extends LitElement {
  componentModel!: ComponentModel;

  constructor() {
    super();
    this.initModel();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  @changeProperty()
  @property({ type: Number })
  public value = 0;

  @property({ type: Number })
  public defaultValue = 0;

  @changeProperty({
    callBack(self, key, value) {
      if (self?.componentModel && self.componentModel?.model) {
        self.componentModel.model[key] = value;
      }
    },
  })
  @property({ type: Number })
  public step = 1;

  @property({ type: Number })
  public precision = 2;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public disabled = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public controls = true;

  @property({ type: String })
  public placeholder = "";

  @property({ type: Number })
  public max = Infinity;

  @property({ type: Number })
  public min = -Infinity;

  @property({ type: String })
  public name = "QInputNumber";

  @property()
  public onBlur!: Function;

  @property()
  public onFocus!: Function;

  @property()
  public onInput!: Function;

  @property()
  public onChange!: Function;

  @property()
  public onMouseEnter!: Function;

  @property()
  public onMouseLeave!: Function;

  @query(".q-input-number_inner")
  public inputNumber!: HTMLInputElement;

  /**
   * 输入框失去焦点
   * @param e
   */
  public handleBlur(e: any) {
    const evt = Array.isArray(e) && e.length ? e[0] : e;
    this.onSendMessage("onBlur");
    if (this.onBlur) {
      return this.onBlur(evt, this.value);
    }
    return this.value;
  }

  /**
   * 输入框聚焦
   * @param e
   */
  public handleFocus(e: any) {
    const evt = Array.isArray(e) && e.length ? e[0] : e;
    this.onSendMessage("onFocus");
    if (this.onFocus) {
      return this.onFocus(evt, this.value);
    }
    return this.value;
  }

  toolNumber(num_str: any) {
    let i;
    num_str = num_str.toString();
    if (num_str.indexOf("+") != -1) {
      num_str = num_str.replace("+", "");
    }
    if (num_str.indexOf("E") != -1 || num_str.indexOf("e") != -1) {
      let resValue = "",
        power: any = "",
        result = null,
        dotIndex = 0,
        resArr: any[] = [],
        sym = "";
      let numStr = num_str.toString();
      if (numStr[0] == "-") {
        // 如果为负数，转成正数处理，先去掉‘-’号，并保存‘-’.
        numStr = numStr.substr(1);
        sym = "-";
      }
      if (numStr.indexOf("E") != -1 || numStr.indexOf("e") != -1) {
        const regExp = new RegExp("^(((\\d+.?\\d+)|(\\d+))[Ee]{1}((-(\\d+))|(\\d+)))$", "ig");
        result = regExp.exec(numStr);
        if (result != null) {
          resValue = result[2];
          power = result[5];
          result = null;
        }
        if (!resValue && !power) {
          return false;
        }
        dotIndex = resValue.indexOf(".") == -1 ? 0 : resValue.indexOf(".");
        resValue = resValue.replace(".", "");
        resArr = resValue.split("");
        if (Number(power) >= 0) {
          const subres = resValue.substr(dotIndex);
          power = Number(power);
          //幂数大于小数点后面的数字位数时，后面加0
          for (i = 0; i <= power - subres.length; i++) {
            resArr.push("0");
          }
          if (power - subres.length < 0) {
            resArr.splice(dotIndex + power, 0, ".");
          }
        } else {
          power = power.replace("-", "");
          power = Number(power);
          //幂数大于等于 小数点的index位置, 前面加0
          for (i = 0; i < power - dotIndex; i++) {
            resArr.unshift("0");
          }
          const n = power - dotIndex >= 0 ? 1 : -(power - dotIndex);
          resArr.splice(n, 0, ".");
        }
      }
      resValue = resArr.join("");

      return sym + resValue;
    } else {
      return num_str;
    }
  }

  /**
   * 输入框输入值修改
   * @param e
   */
  public handleChange(e: any) {
    if (this.disabled) {
      return;
    }
    const evt = Array.isArray(e) && e.length ? e[0] : e;
    this.componentModel.model.value = this.toolNumber(evt.target.value);
    if (this.onChange) {
      return this.onChange(evt.this.value);
    }
    return this.value;
  }

  /**
   * 输入框输入事件
   * @param e
   */
  public handleInput(e: any) {
    if (this.disabled) return;
    const evt = Array.isArray(e) && e.length ? e[0] : e;
    evt.stopPropagation();
    let tempValue = Number(evt.target.value);
    const tempMin = Number(this.min);
    if (!isNaN(tempMin)) {
      tempValue < tempMin ? (tempValue = tempMin) : void 0;
    }
    const tempMax = Number(this.max);
    if (!isNaN(tempMax)) {
      tempValue > tempMax ? (tempValue = tempMax) : void 0;
    }
    tempValue = this.toolNumber(tempValue);
    this.componentModel.model.value = tempValue;
    this.inputNumber.value = String(tempValue);
    this.onSendMessage("change");
    DOMEmit(this, "change", { detail: { value: Number(tempValue) } });
  }

  /**
   * 聚焦
   */
  public focus() {
    this.shadowRoot?.querySelector("input")?.focus();
  }

  /**
   * 失去焦点
   */
  public blur() {
    this.shadowRoot?.querySelector("input")?.blur();
  }

  /**
   * controls输入值修改
   * @param type increase/decrease
   * @param e 事件
   */
  public valueChange(type: string, e: any) {
    if (this.disabled) return;
    let tempStep = this.step;
    if (typeof this.step !== "number" || this.step <= 0) tempStep = 1;
    tempStep = Number(tempStep.toFixed(2));
    let tempValue = Number(this.value);
    switch (type) {
      case "increase":
        const tempMax = Number(this.max);
        if (!isNaN(tempMax)) {
          tempValue + tempStep > tempMax ? (tempValue = tempMax) : (tempValue = tempValue + tempStep);
        } else {
          tempValue = tempValue + tempStep;
        }
        break;
      case "decrease":
        const tempMin = Number(this.min);
        if (!isNaN(tempMin)) {
          tempValue - tempStep < tempMin ? (tempValue = tempMin) : (tempValue = tempValue - tempStep);
        } else {
          tempValue = tempValue - tempStep;
        }
        break;
    }
    // 取数值精度
    if (this.precision >= 0) {
      tempValue = Number(tempValue.toFixed(Math.trunc(this.precision)));
    }
    tempValue = this.toolNumber(tempValue);
    this.componentModel.model.value = tempValue;
    this.inputNumber.value = String(tempValue);
    this.requestUpdate();
    this.onSendMessage("step", { type, value: tempValue });
    DOMEmit(this, "change", { detail: { value: Number(tempValue) } });
  }

  /**
   * 数据重置
   */
  public resetValue() {
    this.componentModel.model.value = this.defaultValue;
  }

  /**
   * 设置value值
   */
  public setValue(value: number) {
    this.componentModel.model.value = value;
  }

  /**
   * 更新input的值
   */
  public setInputNumber() {
    if (isNaN(Number(this.value))) {
      this.value = 0;
    }
    if (this.inputNumber && this.inputNumber.value !== String(this.value)) {
      this.inputNumber.value = String(this.value);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    document.getElementById(this.id)?.addEventListener("keypress", this.pressEnter.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.getElementById(this.id)?.addEventListener("keypress", this.pressEnter.bind(this));
  }

  /**
   * 按下回车
   */
  pressEnter(e: KeyboardEvent) {
    if (e.key === "Enter") {
      this.onSendMessage("pressEnter");
    }
  }

  public render() {
    this.setInputNumber();
    return html`
      <div
        class="${extractClass({}, "q-input-number", {
          "is-disabled": this.disabled,
        })}"
        @mouseenter="${this.onMouseEnter}"
        @mouseleave="${this.onMouseLeave}"
      >
        <input
          type="number"
          class="q-input-number_inner"
          name="${this.name}"
          ?max="${this.max}"
          ?min="${this.min}"
          ?disabled="${this.disabled}"
          placeholder="${this.placeholder}"
          value="${this.value}"
          style="font-size:inherit;background-color: inherit;color: inherit;${this.controls
            ? ""
            : "padding-right: 10px"}"
          @change="${this.handleChange}"
          @focus="${this.handleFocus}"
          @blur="${this.handleBlur}"
          @input="${this.handleInput}"
        />
        ${this.controls
          ? html`
              <div class="q-input-number_button">
                <span
                  role="button"
                  aria-label="increase number"
                  class="${extractClass({}, "q-input-number_increase", {
                    "is-disabled": this.disabled,
                    "is-hover": !this.disabled,
                  })}"
                  @click="${(e: any) => {
                    this.valueChange("increase", e);
                  }}"
                >
                  <i class="input-icon">
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill="currentColor"
                        d="m488.832 344.32-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872 319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0z"
                      ></path>
                    </svg>
                  </i>
                </span>
                <span
                  role="button"
                  aria-label="decrease number"
                  class="${extractClass({}, "q-input-number_decrease", {
                    "is-disabled": this.disabled,
                    "is-hover": !this.disabled,
                  })}"
                  @click="${(e: any) => {
                    this.valueChange("decrease", e);
                  }}"
                >
                  <i class="input-icon">
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill="currentColor"
                        d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
                      ></path>
                    </svg>
                  </i>
                </span>
              </div>
            `
          : null}
      </div>
    `;
  }

  onSendMessage(type: string, value?: any) {
    if (value) value.value = this.toolNumber(value.value);
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: type,
        dstType: "",
      },
      body: value || this.toolNumber(this.value),
    };
    this.componentModel.sendMessage(message);
    sendFormMsg(this);
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-input-number";
          },
          get type() {
            return EComponentType.FROM;
          },
          get text() {
            return "数字输入框";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "用于纯数字输入";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "更改组件数据",
                eventType: "changeInfo",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "重置组件数据",
                eventType: "resetInfo",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "设置组件数据",
                eventType: "setInfo",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "组件数据变更",
                eventType: "change",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "组件聚焦",
                eventType: "onFocus",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "组件失焦",
                eventType: "onBlur",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "按下回车",
                eventType: "pressEnter",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "组件增减按钮点击",
                eventType: "step",
                messageSchema: "",
                messageDemo: "",
              },
            ],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                value: {
                  type: "string",
                  description: "输入框值",
                },
                name: {
                  type: "string",
                  description: "标识",
                },
                step: {
                  type: "number",
                  description: "每次增加的数值大小",
                },
                precision: {
                  type: "number",
                  description: "输入框值",
                },
                disabled: {
                  type: "boolean",
                  description: "是否禁用",
                },
                controls: {
                  type: "boolean",
                  description: "是否开启增减按钮",
                },
                placeholder: {
                  type: "string",
                  description: "默认提示",
                },
                max: {
                  type: "number",
                  description: "输入框最大值",
                },
                min: {
                  type: "number",
                  description: "输入框最小值",
                },
              },
            },
          },
        },
        get iovSchema() {
          return this["_iovSchema"];
        },
        set iovSchema(value) {
          if (value === this["_iovSchema"] || isEqual(value, this["_iovSchema"])) {
            return;
          }
          this["_iovSchema"] = value;
        },
        _onMessageMeta: {
          setInfo: [
            function (e: IMessage) {
              // @ts-ignore
              this.setValue(e.body);
            },
          ],
          changeInfo: [
            function (e: IMessage) {
              // @ts-ignore
              this.setValue(e.body);
            },
          ],
          resetInfo: [
            function (e: IMessage) {
              // @ts-ignore
              this.resetValue();
            },
          ],
        },
        _onDOMEvent: {},
        _initStyle: "height:28px;width:150px;",
        _onWatchSetting: {
          value: [
            function (newVal: any, oldVal: any, context: any) {
              // @ts-ignore
              self.onSendMessage("change");
            },
          ],
        },
        _lifeCycle: {
          created: function () {},
          updated: function (el: HTMLElement, data: any) {},
          destroy: function () {},
        },
        get value() {
          return self.value;
        },
        set value(value) {
          self.value = value;
        },
        get defaultValue() {
          return self.defaultValue;
        },
        set defaultValue(value) {
          self.defaultValue = value;
        },
        get step() {
          return self.step;
        },
        set step(value) {
          if (value === self.step) return;
          self.step = cloneDeep(value);
        },
        get precision() {
          return self.precision;
        },
        set precision(value) {
          self.precision = value;
        },
        get disabled() {
          return self.disabled;
        },
        set disabled(value) {
          self.disabled = value;
        },
        get controls() {
          return self.controls;
        },
        set controls(value) {
          self.controls = value;
        },
        get placeholder() {
          return self.placeholder;
        },
        set placeholder(value) {
          self.placeholder = value;
        },
        get max() {
          return self.max;
        },
        set max(value) {
          self.max = value;
        },
        get min() {
          return self.min;
        },
        set min(value) {
          self.min = value;
        },
        get name() {
          return self.name;
        },
        set name(value) {
          self.name = value;
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-input-number": QInputNumber;
  }
}
