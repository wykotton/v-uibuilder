import { css, html, LitElement, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";
import { customHasElement } from "../../types/runtime/decorators/decorators";
import { isEqual } from "lodash-es";
import { extractClass } from "../../common";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import { IMessage } from "../../types/runtime/IMessage";
import { ISchema } from "../../types/runtime/IModelSchema";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform, sendFormMsg } from "../../util/utils";
import cssIndex from "./index.scss?inline";

type TypeEnums = "textarea" | "input";
type UISize = "medium" | "small" | "mini";
@customHasElement("q-input")
export class QInput extends LitElement {
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
  @property({ type: String, reflect: true })
  public value = "";

  @property({ type: String, reflect: true })
  public defaultValue = "";

  // 禁用
  @changeProperty()
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public disabled = false;

  @changeProperty()
  @property({ type: String })
  public type: TypeEnums = "input";

  @changeProperty()
  @property({ type: String })
  public placeholder!: string;

  // 可清除
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public clearable!: boolean;

  @property({ type: String })
  public suffixIcon = "";

  @property({ type: String })
  public prefixIcon = "";

  @property({ type: Number })
  public maxLength = 0;

  @property({ type: Number })
  public minLength = 0;

  // 开启自动完成
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public autoComplete!: boolean;

  @property({ type: Boolean })
  public block!: boolean;

  @property({ type: String })
  public name = "QInput";

  @property({ type: String })
  public form!: string;

  @property({ type: Number })
  public rows = 1;

  @property({ type: String, attribute: "size" })
  public size: UISize = "mini";

  @changeProperty()
  @property()
  public onBlur!: Function;

  @changeProperty()
  @property()
  public onFocus!: Function;

  @changeProperty()
  @property()
  public onInput!: Function;

  @changeProperty()
  @property()
  public onChange!: Function;

  @changeProperty()
  @property()
  public onMouseEnter!: Function;

  @changeProperty()
  @property()
  public onMouseLeave!: Function;

  @query(".inputRef")
  public inputRef!: HTMLInputElement;

  public $value: string | undefined;

  public tempTagName = "";

  public tempInputTagName = "";

  public valueLength = 0;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

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

  /**
   * 输入框输入值修改
   * @param e
   */
  public handleChange(e: any) {
    if (this.disabled) {
      return;
    }
    const evt = Array.isArray(e) && e.length ? e[0] : e;
    this.$value = evt.target.value;
    this.value = evt.target.value;

    if (this.onChange) {
      return this.onChange(evt.this.value);
    }
    this.emitEvn(e);
    return this.value;
  }

  /**
   * 输入框输入事件
   * @param e
   */
  public handleInput(e: any) {
    if (this.disabled) {
      return;
    }
    const evt = Array.isArray(e) && e.length ? e[0] : e;
    evt.stopPropagation();
    this.$value = evt.target.value;
    let tempValue = evt.target.value;

    if (this.maxLength && this.maxLength > 0) {
      this.valueLength = evt.target.value.length;
      if (this.valueLength > this.maxLength) {
        tempValue = tempValue.slice(0, this.maxLength);
        this.inputRef ? (this.inputRef.value = tempValue) : void 0;
      }
    }
    this.componentModel.model.value = tempValue;
    this?.onSendMessage?.("change");
    if (this.onInput) {
      return this.onInput(evt, this.value);
    }
    this.emitEvn(e);
    return this.value;
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

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * 按下回车
   */
  pressEnter(e: KeyboardEvent) {
    if (e.key === "Enter") {
      this.onSendMessage("pressEnter");
    }
  }

  /**
   * 清除
   */
  public clearInput(e: Event) {
    this.componentModel.model.value = "";
    this.$value = "";
    this.valueLength = 0;
    this.onSendMessage("change");
    DOMEmit(this, "clear", { detail: { value: this.value, e } });
    return this.value;
  }

  /**
   * 抛出事件
   */
  public emitEvn(e: any) {
    DOMEmit(this, "onChange", { detail: { value: this.value, e } });
  }

  /**
   * 数据重置
   */
  public resetValue() {
    this.componentModel.model.value = this.defaultValue;
    this.onSendMessage("change");
  }

  /**
   * 设置value值
   */
  public setValue(value: string) {
    this.componentModel.model.value = value;
    this.onSendMessage("change");
  }

  /**
   * 组件点击
   */
  public inputClick() {
    this.onSendMessage("click");
  }

  public render() {
    this.tempTagName = "q-icon-" + (this.suffixIcon || this.prefixIcon);
    this.tempInputTagName = this.type === "textarea" ? "textarea" : "input";

    const attrMap = {} as { [key: string]: any };
    if (this.maxLength) {
      attrMap["max-length"] = this.maxLength;
    }
    if (this.minLength) {
      attrMap["min-length"] = this.minLength;
    }
    if (this.inputRef) {
      this.inputRef.value = this.value;
    }
    this.valueLength = this?.value?.length || 0;
    return html`
      <div
        class=${extractClass({}, `q-${this.tempInputTagName} `, {
          "is-disabled": this.disabled,
          "q-input-suffix": this.suffixIcon,
          "q-input-prefix": this.prefixIcon,
          "is-block": this.block,
        })}
        @mouseenter=${this.onMouseEnter}
        @mouseleave=${this.onMouseLeave}
        @click=${this.inputClick}
        onkeydown=${(event: KeyboardEvent) => this.pressEnter(event)}
      >
        ${(this.prefixIcon || this.suffixIcon) &&
        html` <${this.tempTagName} 
	                   class=${extractClass({}, "o-input_icon", {
                       "is-prefix": this.prefixIcon,
                       "is-suffix": this.suffixIcon,
                     })}
	           ></${this.tempTagName}>`}
        ${this.tempInputTagName === "input"
          ? html`
              <input
                type=${this.type}
                name=${this.name}
                ?disabled=${this.disabled}
                placeholder=${this.placeholder}
                form=${this.form}
                value=${this.value}
                rows=${this.rows}
                class=${`inputRef q-${this.tempInputTagName}_inner`}
                ?autocomplete=${this.autoComplete}
                ?block=${this.block}
                @change=${this.handleChange}
                @focus=${this.handleFocus}
                @blur=${this.handleBlur}
                @input=${this.handleInput}
              />
            `
          : html`
              <textarea
                type=${this.type}
"               name=${this.name}
                ?disabled=${this.disabled}
                placeholder=${this.placeholder}
                form=${this.form}
                rows=${this.rows}
                class=${`inputRef q-${this.tempInputTagName}_inner`}
                ?autocomplete=${this.autoComplete}
                ?block=${this.block}
                @change=${this.handleChange}
                @focus=${this.handleFocus}
                @blur=${this.handleBlur}
                @input=${this.handleInput}
              >
${this.value}</textarea
              >
            `}
        ${this.clearable && !this.disabled
          ? html`
              <div class="q-input_suffix">
                <svg
                  @click=${this.clearInput}
                  class="q-input_clear"
                  fill="currentColor"
                  width="1em"
                  height="1em"
                  focusable="false"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  />
                </svg>
              </div>
            `
          : ""}
        ${this.maxLength && this.tempInputTagName === "textarea"
          ? html`
              <div class="q-input_count">${this.valueLength}/${this.maxLength}</div>
            `
          : ""}
        ${this.maxLength && this.tempInputTagName === "input"
          ? html`
	                <span class="q-input_suffix">
	                    <span class="el-input_suffix-inner">
	                        <span class="q-input_count">
	                            <span class="q-input_count-inner">
	                                ${this.valueLength}/${this.maxLength}
	                            </span>
	                        </span>
	                    </span>
	                </span>
	              </span>
	            </span>
	          </span>
	        `
          : ""}
      </div>
    `;
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-input";
          },
          get text() {
            return "输入框";
          },
          get type() {
            return "表单";
          },
          get group() {
            return ["UIB原子元件"];
          },
          get image() {
            return "";
          },
          get description() {
            return "文本组件,可以编写文字信息";
          },
          get version() {
            return "1.0.0";
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
                text: "组件数据点击",
                eventType: "click",
                messageSchema: "",
                messageDemo: "文本数据1",
              },
              {
                text: "组件数据更改",
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
            ],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                value: {
                  type: "string",
                  description: "组件输入框数据",
                },
                defaultValue: {
                  type: "string",
                  description: "组件输入框默认数据",
                },
                name: {
                  type: "string",
                  description: "标识",
                },
                disabled: {
                  type: "boolean",
                  description: "组件输入框是否禁用",
                },
                clearable: {
                  type: "boolean",
                  description: "组件输入框是否清除",
                },
                type: {
                  type: "string",
                  description: "单行/多行文本",
                  enum: [
                    { label: "单行文本", value: "input" },
                    { label: "多行文本", value: "textarea" },
                  ],
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
        _initStyle: "height:28px;width:150px;border:1px solid #ccc;background-color:#fff;",
        _onDOMEvent: {
          click: [
            function (e: Event) {
              console.log(e);
            },
          ],
          dblclick: [
            function (e: Event) {
              console.log(e, "dblclick");
            },
          ],
        },
        _onWatchSetting: {
          value: [function (newVal: any, oldVal: any, context: any) {}],
          prop: [
            function (newVal: any, oldVal: any, context: any) {
              console.log(newVal, oldVal, context);
            },
          ],
          onDOMEvent: [
            function (newVal: any, oldVal: any, context: any) {
              console.log(newVal, oldVal, context, "onDOMEvent");
            },
          ],
        },
        _lifeCycle: {
          created: function () {
            console.log("created");
          },
          updated: function () {
            console.log("updated");
          },
          destroy: function () {
            console.log("destroy");
          },
        },
        get value() {
          return self.value;
        },
        set value(value) {
          if (value === self.value) {
            return;
          }
          self.value = value;
        },
        get defaultValue() {
          return self.defaultValue;
        },
        set defaultValue(value) {
          if (value === self.defaultValue) {
            return;
          }
          self.defaultValue = value;
        },
        get disabled() {
          return self.disabled;
        },
        set disabled(value) {
          if (value === self.disabled) {
            return;
          }
          self.disabled = value;
        },
        get clearable() {
          return self.clearable;
        },
        set clearable(value) {
          if (value === self.clearable) {
            return;
          }
          self.clearable = value;
        },
        get type() {
          return self.type;
        },
        set type(value) {
          if (value === self.type) {
            return;
          }
          self.type = value;
        },
        get name() {
          return self.name;
        },
        set name(value) {
          if (value === self.name) {
            return;
          }
          self.name = value;
        },
      } as unknown as ISchema,
    });
  }

  onSendMessage(type: string) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: type,
        dstType: "",
      },
      body: this.value || "",
    };
    this.componentModel.sendMessage(message);
    sendFormMsg(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-input": QInput;
  }
}
