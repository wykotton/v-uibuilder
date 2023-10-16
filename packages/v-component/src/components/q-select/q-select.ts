import { css, html, unsafeCSS } from "lit";
import { property, query, queryAll } from "lit/decorators.js";
import { customHasElement } from "../../types/runtime/decorators/decorators";
import { styleMap } from "lit/directives/style-map.js";
import { cloneDeep, isArray, isEqual, isString } from "lodash-es";
import { extractClass } from "../../common";
import { Component } from "../../types/runtime/Component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform, sendFormMsg } from "../../util/utils";
import "../q-popover/q-popover";
import { QPopover } from "../q-popover/q-popover";
import "../q-select-option/q-select-option";
import { QSelectOption } from "../q-select-option/q-select-option";
import cssIndex from "./index.scss?inline";

type UISize = "medium" | "small" | "mini";

@customHasElement("q-select")
export class QSelect extends Component {
  constructor() {
    super();
    this.initModel();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  @property({ type: Array })
  public options = [
    {
      label: "下拉1",
      value: "1",
    },
    {
      label: "下拉2",
      value: "2",
    },
    {
      label: "下拉3",
      value: "3",
    },
  ];

  @property({ reflect: true })
  public value: string | string[] = "1";

  @property({ reflect: true })
  public defaultValue: string | string[] = "1";

  @property({ type: String })
  public size: UISize = "medium";

  @property({ type: String })
  public name = "QSelect";

  @property({ type: String })
  public inputPadding = "0 0 0 8px";

  @property({ type: String })
  public checkedFontColor = "#409eff";

  @property({ type: String })
  public checkedBgColor = "#fff";

  @property({ type: String })
  public bgColor = "#fff";

  @property({ type: String })
  public defaultFontColor = "#000";

  @property({ type: String })
  public hoverBgColor = "#e5e5e5";

  @property({ type: String })
  public hoverFontColor = "#000";

  @property({ type: String })
  public tagFontColor = "#5083e4";

  @property({ type: String })
  public tagBgColor = "#e6f7ff";

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public multiple = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public clearable = false;

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
  public collapseTags = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public isFocus = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public active = false;

  @property({ type: String })
  public placeholder = "";

  @query("q-popover")
  public popoverRef!: QPopover;

  @queryAll("q-select-option")
  public optionRefs!: QSelectOption[];

  @query(".q-input_inner")
  public inputSelect!: HTMLInputElement;

  /**
   * 多选tag大小
   */
  get collapseTagSize() {
    return ["small", "mini"].indexOf(this.size) > -1 ? "mini" : "small";
  }

  get currentDisabled() {
    return this.disabled;
  }

  get selectSize() {
    return this.size;
  }

  public hoverIndex = -1;

  public popover = null;

  public tagsRef = null;

  public _refInput = null;

  public selectedItems: any = [];

  public previousQuery = "";

  public timeout: any = null;

  /**
   * value变更消息
   */
  public valueChangeMessage() {
    this.componentModel.sendMessage({
      header: { src: this.id, srcType: "selectChange", dst: "", dstType: "" },
      body: this.value,
    });
    this.updateSelectList();
  }

  /**
   * 下拉选项点击
   */
  public optionClick(ev: CustomEvent) {
    ev.stopPropagation;
    const detail = ev.detail;
    if (this.multiple) {
      isArray(this.value) ? void 0 : (this.componentModel.model.value = "");
      if (isArray(this.value)) {
        const tempValue = cloneDeep(this.value);
        const index: number = tempValue.findIndex((item) => item === detail.value);
        const itemIndex: number = this.selectedItems.findIndex((item: any) => item.value === detail.value);
        if (detail.selected) {
          index >= 0 ? void 0 : tempValue.push(detail.value);
          itemIndex >= 0 ? void 0 : this.selectedItems.push({ label: detail.label, value: detail.value });
        } else {
          index >= 0 ? tempValue.splice(index, 1) : void 0;
          itemIndex >= 0 ? this.selectedItems.splice(itemIndex, 1) : void 0;
        }
        this.componentModel.model.value = tempValue.join(",");
      }
    } else {
      this.componentModel.model.value = detail.value;
      this.selectedItems[0] = detail;
      Promise.resolve().then(() => {
        this.popoverRef?.leave?.();
      });
    }
    this.valueChangeMessage();
  }

  /**
   * 更新子项数据
   */
  public updateSelectList() {
    this.optionRefs.forEach((element) => {
      if (this.multiple) {
        this.value.includes(element.value) ? (element.selected = true) : (element.selected = false);
      } else {
        this.value === element.value ? (element.selected = true) : (element.selected = false);
      }
    });
    sendFormMsg(this);
    DOMEmit(this, "onChange", { detail: { value: this.value } });
    this.requestUpdate();
  }

  /**
   * 输入框点击
   */
  public onInputClick() {
    if (!this.clearable || this.disabled) return;
    this.active = true;
  }

  /**
   * 输入框失去焦点
   */
  public onInputBlur() {
    this.active = false;
    this.previousQuery = "";
  }

  /**
   * 输入框鼠标移入
   */
  public onMouseenter() {
    if (!this.clearable || this.disabled) return;
    this.active = true;
  }

  /**
   * 鼠标离开
   */
  public onMouseleave() {
    this.active = false;
  }

  /**
   * 输入框聚焦
   */
  public handleFocus() {
    this.filter();
  }

  /**
   * 输入框值修改
   * @param e
   */
  public debouncedQueryChange(e: any) {
    if (this.disabled) return;
    this.previousQuery = e.target.value.replace(/(^\s*)|(\s*$)/g, "");
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.filter();
    }, 200);
  }

  public filter() {}

  /**
   * 关闭标签
   * @param value
   */
  public closeTag(value: string) {
    if (this.disabled) return;
    const tempValue = cloneDeep(this.value) as string[];
    const itemIndex = this.selectedItems.findIndex((item: any) => item.value === value);
    const index = tempValue.findIndex((item: any) => item === value);
    this.selectedItems.splice(itemIndex, 1);
    tempValue.splice(index, 1);
    this.componentModel.model.value = tempValue.join(",");
    this.valueChangeMessage();
  }

  /**
   * 清空数据
   */
  public clearSelect(event: any) {
    if (this.disabled) return;
    event.stopPropagation();
    this.selectedItems = [];
    this.componentModel.model.value = "";
    this.previousQuery = "";
    (this as any).update();
    this.valueChangeMessage();
  }

  /**
   * 格式化value数据
   */
  public valueFormat() {
    if (this.multiple) {
      this.selectedItems = [];
      try {
        if (isString(this.value)) {
          this.componentModel.model.value = this.value;
        }
        if (isArray(this.value)) {
          this.value.forEach((value: any) => {
            const itemIndex: number = this.selectedItems.findIndex((item: any) => item.value === value);
            const index = this.options.findIndex((item: any) => item.value === value);
            index >= 0 && itemIndex < 0 ? this.selectedItems.push(this.options[index]) : void 0;
          });
        }
      } catch (error) {
        console.log(error);
      }
      // 更新input的value值
      if (this.inputSelect) {
        this.inputSelect.value = "";
      }
    } else {
      if (isArray(this.value)) {
        this.componentModel.model.value = String(this.value[0]) || "";
      }
      const index = this.options.findIndex((item: any) => item.value === this.value);
      index >= 0 ? (this.selectedItems[0] = this.options[index]) : (this.selectedItems = []);
      // 更新input的value值
      if (this.inputSelect) {
        // console.log(this.selectedItems[0]?.label || this.value);
        this.inputSelect.value = this.selectedItems[0]?.label || this.value;
      }
    }
  }

  /**
   * 设置value值
   */
  public setOptions(value: { label: string; value: string }[]) {
    if (!isArray(value)) return;
    for (const item of value) {
      if (!item.label || !item.value) return;
    }
    this.componentModel.model.options = value;
  }

  /**
   * 设置value值
   */
  public setValue(value: string) {
    this.componentModel.model.value = value;
  }

  /**
   * 数据重置
   */
  public resetValue() {
    this.componentModel.model.value = this.defaultValue;
  }

  public render() {
    this.valueFormat();
    return html`
      <div
        class=${extractClass({}, "q-select", {
          ["q-select-" + this.size]: this.size,
          "is-disabled": this.disabled,
        })}
        @mouseenter=${this.onMouseenter.bind(this)}
        @mouseleave=${this.onMouseleave.bind(this)}
      >
        <q-popover position="bottom" show_arrow="false" disabled=${this.disabled}>
          <div style="width: 100%;height:100%">
            ${this.multiple
              ? html`
                  <div style="width: 100%;height:96%;overflow:auto;position: absolute;">
                    <div class="q-select_tags" style="width: calc(100% - 30px)">
                      ${Array.isArray(this.selectedItems) && this.collapseTags && this.selectedItems.length
                        ? html`
                            <div
                              class="q-select_tags-content"
                              style=${styleMap({ backgroundColor: this.tagBgColor, color: this.tagFontColor })}
                            >
                              <span>${this.selectedItems[0].label}</span>
                            </div>
                            ${this.selectedItems.length > 1
                              ? html`
                                  <div
                                    class="q-select_tags-content"
                                    style=${styleMap({ backgroundColor: this.tagBgColor, color: this.tagFontColor })}
                                  >
                                    <span>+${this.selectedItems.length - 1}</span>
                                  </div>
                                `
                              : null}
                          `
                        : null}
                      ${Array.isArray(this.selectedItems) && !this.collapseTags && this.selectedItems.length
                        ? this.selectedItems.map((item) => {
                            return html`
                              <div
                                class="q-select_tags-content"
                                style=${styleMap({ backgroundColor: this.tagBgColor, color: this.tagFontColor })}
                              >
                                <span>${item.label}</span>
                                <span
                                  class="q-select_tags-close"
                                  @click=${(e: any) => {
                                    e.stopPropagation;
                                    this.closeTag(item.value);
                                  }}
                                >
                                  X
                                </span>
                              </div>
                            `;
                          })
                        : null}
                      <!-- <input
                        type="text"
                        autocomplete="off"
                        class=${this.selectSize ? `is-${this.selectSize} q-select_input` : "q-select_input"}
                        disabled=${this.currentDisabled}
                        readonly="readonly"
                        style="flex-grow: 1; width: 0.0961538%"
                      /> -->
                    </div>
                  </div>
                `
              : null}
            <div
              class=${extractClass({}, "q-input q-input-suffix", {
                ["q-input-" + this.size]: this.size,
                "is-focus": this.isFocus,
                "is-disabled": this.disabled,
              })}
            >
              <input
                type="text"
                style=${styleMap({ padding: this.inputPadding })}
                @click=${this.onInputClick.bind(this)}
                @blur=${this.onInputBlur.bind(this)}
                @focus=${this.handleFocus.bind(this)}
                @input=${this.debouncedQueryChange.bind(this)}
                readonly="readonly"
                value=${this.multiple ? "" : this.selectedItems[0]?.label || this.value}
                autocomplete="off"
                placeholder=${Array.isArray(this.selectedItems) && this.selectedItems.length ? "" : this.placeholder}
                class="q-input_inner"
              />

              ${this.clearable && !this.disabled && this.active
                ? html`
                    <div class="q-input_suffix-clearable">
                      <svg
                        @click=${this.clearSelect.bind(this)}
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
                : html`
                    <div>
                      <span class="q-input_suffix">
                        <span class="q-input_suffix-inner">
                          <i class="q-select_caret q-input_icon q-icon-arrow-up is-reverse"></i>
                        </span>
                      </span>

                      <svg
                        @click=${this.onInputClick.bind(this)}
                        viewBox="0 0 24 24"
                        class="arrow"
                        data-icon="caret-down"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                      </svg>
                    </div>
                  `}
            </div>
          </div>
          <div slot="popover" class="q-select-dropdown_wrap" style=${styleMap({ backgroundColor: this.bgColor })}>
            ${this.options.map((item: any) => {
              return html`
                <q-select-option
                  hoverBgColor=${this.hoverBgColor}
                  hoverFontColor=${this.hoverFontColor}
                  defaultFontColor=${this.defaultFontColor}
                  selectedBgColor=${this.checkedBgColor}
                  selectedFontColor=${this.checkedFontColor}
                  label=${item.label}
                  value=${item.value}
                  disabled=${item.disabled}
                  visible=${!(typeof item.visible === "boolean" && !item.visible)}
                  size=${item.size || this.size}
                  selected=${this.multiple ? this.value.includes(item.value) : this.value === item.value}
                  @change=${this.optionClick.bind(this)}
                ></q-select-option>
              `;
            })}
          </div>
        </q-popover>
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
            return "q-select";
          },
          get type() {
            return EComponentType.FROM;
          },
          get text() {
            return "下拉框";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "下拉框组件,可以进行下拉选择";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "更改组件可选项数据",
                eventType: "changeOptions",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "更改组件选中值",
                eventType: "changeValue",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "重置组件选中值",
                eventType: "resetInfo",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "组件选中值变更",
                eventType: "selectChange",
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
                  description: "组件选中值",
                },
                defaultValue: {
                  type: "string",
                  description: "组件默认选中值",
                },
                name: {
                  type: "string",
                  description: "标识",
                },
                options: {
                  type: "array",
                  description: "组件可选项",
                  items: {
                    type: "object",
                    description: "组件选项",
                    properties: {
                      label: {
                        type: "string",
                        description: "选项名称",
                      },
                      value: {
                        type: "string",
                        description: "选项值",
                      },
                    },
                  },
                },
                disabled: {
                  type: "boolean",
                  description: "是否禁用组件",
                },
                clearable: {
                  type: "boolean",
                  description: "是否显示清除按钮",
                },
                multiple: {
                  type: "boolean",
                  description: "是否开启多选",
                },
                collapseTags: {
                  type: "boolean",
                  description: "多选项自动折叠",
                },
                inputPadding: {
                  type: "string",
                  description: "选择框内边距",
                },
                defaultFontColor: {
                  type: "string",
                  description: "弹出框默认字体色",
                  format: "color",
                },
                bgColor: {
                  type: "string",
                  description: "弹出框背景色",
                  format: "color",
                },
                checkedFontColor: {
                  type: "string",
                  description: "弹出框字体选中色",
                  format: "color",
                },
                checkedBgColor: {
                  type: "string",
                  description: "弹出框选中背景色",
                  format: "color",
                },
                hoverBgColor: {
                  type: "string",
                  description: "弹出框鼠标悬浮背景色",
                  format: "color",
                },
                hoverFontColor: {
                  type: "string",
                  description: "弹出框鼠标悬浮字体色",
                  format: "color",
                },
                tagBgColor: {
                  type: "string",
                  description: "多选时tag背景色",
                  format: "color",
                },
                tagFontColor: {
                  type: "string",
                  description: "多选时tag字体色",
                  format: "color",
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
          changeOptions: [
            function (e: IMessage) {
              // @ts-ignore
              this.setOptions(e.body);
            },
          ],
          changeValue: [
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
        _onDOMEvent: {
          onclick: [
            function (e: Event) {
              console.log(e);
            },
          ],
          ondblclick: [
            function (e: Event) {
              console.log(e, "dblclick");
            },
          ],
        },
        _initStyle:
          "height: 28px; width: 150px;color: rgb(0, 0, 0); border: 1px solid rgb(230, 230, 230);border-radius: 4px; background-color: rgb(255, 255, 255);",
        _onWatchSetting: {
          value: [
            function (newVal: any, oldVal: any, context: any) {
              self.onSendMessage();
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
            console.log("lifeCycle created");
          },
          updated: function () {
            console.log("lifeCycle updated");
          },
          destroy: function () {
            console.log("lifeCycle destroy");
          },
        },
        get value() {
          if (self.multiple && Array.isArray(self.value)) {
            return self.value.join(",");
          } else if (Array.isArray(self.value)) {
            return String(self.value[0]);
          } else {
            return String(self.value);
          }
        },
        set value(value) {
          if (self.multiple) {
            try {
              if (!value) {
                self.value = [];
                return;
              }
              if (Array.isArray(self.value) && self.value.join(",") === value) return;
              self.value = (value as string).split(",");
            } catch (error) {
              if (Array.isArray(self.value)) return;
              self.value = [];
            }
          } else {
            if (typeof value !== "string" || value === self.value) return;
            self.value = value;
          }
        },
        get options() {
          return self.options;
        },
        set options(value) {
          self.options = value;
        },
        get defaultValue() {
          return self.defaultValue;
        },
        set defaultValue(value) {
          self.defaultValue = value;
        },
        get name() {
          return self.name;
        },
        set name(value) {
          self.name = value;
        },
        get multiple() {
          return self.multiple;
        },
        set multiple(value) {
          self.multiple = value;
        },
        get clearable() {
          return self.clearable;
        },
        set clearable(value) {
          self.clearable = value;
        },
        get disabled() {
          return self.disabled;
        },
        set disabled(value) {
          self.disabled = value;
        },
        get collapseTags() {
          return self.collapseTags;
        },
        set collapseTags(value) {
          self.collapseTags = value;
        },
        get bgColor() {
          return self.bgColor;
        },
        set bgColor(value) {
          if (value === self.bgColor) {
            return;
          }
          self.bgColor = value;
        },
        get checkedBgColor() {
          return self.checkedBgColor;
        },
        set checkedBgColor(value) {
          if (value === self.checkedBgColor) {
            return;
          }
          self.checkedBgColor = value;
        },
        get checkedFontColor() {
          return self.checkedFontColor;
        },
        set checkedFontColor(value) {
          if (value === self.checkedFontColor) {
            return;
          }
          self.checkedFontColor = value;
        },
        get defaultFontColor() {
          return self.defaultFontColor;
        },
        set defaultFontColor(value) {
          if (value === self.defaultFontColor) {
            return;
          }
          self.defaultFontColor = value;
        },
        get hoverBgColor() {
          return self.hoverBgColor;
        },
        set hoverBgColor(value) {
          if (value === self.hoverBgColor) {
            return;
          }
          self.hoverBgColor = value;
        },
        get hoverFontColor() {
          return self.hoverFontColor;
        },
        set hoverFontColor(value) {
          if (value === self.hoverFontColor) {
            return;
          }
          self.hoverFontColor = value;
        },
        get inputPadding() {
          return self.inputPadding;
        },
        set inputPadding(value) {
          if (value === self.hoverFontColor) {
            return;
          }
          self.inputPadding = value;
        },
        get tagBgColor() {
          return self.hoverBgColor;
        },
        set tagBgColor(value) {
          if (value === self.tagBgColor) {
            return;
          }
          self.tagBgColor = value;
        },
        get tagFontColor() {
          return self.tagFontColor;
        },
        set tagFontColor(value) {
          if (value === self.tagFontColor) {
            return;
          }
          self.tagFontColor = value;
        },
      } as unknown as ISchema,
    });
  }

  onSendMessage() {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: "throwFormData",
        dstType: "",
      },
      body: this.value,
    };
    this.componentModel.sendMessage(message);
    sendFormMsg(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-select": QSelect;
  }
}
