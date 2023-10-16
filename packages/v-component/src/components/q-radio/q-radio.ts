import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { extractClass } from "../../common";
import { Component } from "../../types/runtime/Component";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform } from "../../util/utils";
import cssIndex from "./index.scss?inline";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { isEqual } from "lodash-es";
import { IMessage } from "../../types/runtime/IMessage";

type UISize = "medium" | "small" | "mini";

@customElement("q-radio")
export class QRadio extends Component {
  /**
   * 数据模型
   */
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

  @property({ type: String })
  public size: UISize = "medium";

  @property({ type: String })
  public label = "单选框";

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
  public checked = false;

  @property({ type: String })
  public value = "1";

  @property({ type: String })
  public name = "QRadio";

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public border = false;

  /**
   * 值修改
   * @param evnet
   */
  public handleChange(ev: Event) {
    if (this.disabled) return;
    this.checked = !this.checked;
    const detail = {
      label: this.label,
      value: this.value,
      checked: this.checked,
    };
    DOMEmit(this, "change", { detail: detail });
  }

  public render() {
    return html`
      <label
        role="radio"
        tabindex="0"
        class=${extractClass({}, "q-radio", {
          ["q-radio-" + this.size]: this.size,
          "is-disabled": this.disabled,
          "is-border": this.border,
          "is-checked": this.checked,
        })}
        style="font-size: inherit;color: inherit"
        aria-checked=${this.checked}
        @click=${this.handleChange.bind(this)}
      >
        <div
          class=${extractClass({}, "q-radio_input", {
            "is-disabled": this.disabled,
            "is-checked": this.checked,
          })}
        >
          <span class="q-radio_inner"></span>
          <input
            type="radio"
            aria-hidden="true"
            disabled=${this.disabled}
            checked=${this.checked}
            value=${this.value}
            tabindex="-1"
            class="q-radio_original"
          />
        </div>
        <div class="q-radio_label">
          ${this.label
            ? this.label
            : html`
                <slot></slot>
              `}
        </div>
      </label>
    `;
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-radio";
          },
          get type() {
            return EComponentType.FROM;
          },
          get text() {
            return "单选框";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "单选框，用于在多个选项中选择单个结果。";
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
            ],
            outputMessage: [
              {
                text: "组件点击数据",
                eventType: "click",
                messageSchema: "",
                messageDemo: "文本数据1",
              },
            ],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "组件id",
                  disabled: true,
                },
                label: {
                  type: "string",
                  description: "选项名称",
                },
                value: {
                  type: "string",
                  description: "指定选中的选项",
                },
                checked: {
                  type: "boolean",
                  description: "是否被选中",
                },
                disabled: {
                  type: "boolean",
                  description: "是否禁用",
                },
                border: {
                  type: "boolean",
                  description: "是否有边框",
                },

                contextType: {
                  type: "boolean",
                  description: "contextType",
                },
                _onMessageMeta: {
                  type: "object",
                  description: "消息元",
                  properties: {
                    changeInfo: {
                      type: "array",
                      description: "更改数据",
                      items: {
                        type: "string",
                        description: "函数片段",
                        format: "code",
                      },
                    },
                  },
                },
                _onWatchSetting: {
                  type: "object",
                  description: "消息元",
                  properties: {
                    text: {
                      type: "array",
                      description: "更改数据",
                      items: {
                        type: "string",
                        description: "函数片段",
                        format: "code",
                      },
                    },
                  },
                },
                _onDOMEvent: {
                  type: "object",
                  description: "DOM事件",
                  properties: {
                    click: {
                      type: "array",
                      description: "点击事件",
                      items: {
                        type: "string",
                        description: "函数片段",
                        format: "code",
                      },
                    },
                    dblclick: {
                      type: "array",
                      description: "双击事件",
                      items: {
                        type: "string",
                        description: "函数片段",
                        format: "code",
                      },
                    },
                  },
                },
                _lifeCycle: {
                  type: "object",
                  description: "生命周期",
                  properties: {
                    created: {
                      type: "string",
                      description: "创建",
                      format: "textarea",
                    },
                    updated: {
                      type: "string",
                      description: "更新",
                      format: "textarea",
                    },
                    destroy: {
                      type: "string",
                      description: "销毁",
                      format: "code",
                    },
                  },
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
          changeInfo: [
            function (e: IMessage) {
              console.log(e, self);
            },
          ],
        },
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
        _initStyle: "",
        _onWatchSetting: {
          value: [function (newVal: any, oldVal: any, context: any) {}],
        },
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
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
        get label() {
          return self.label;
        },
        set label(value) {
          if (value === self.label) {
            return;
          }
          self.label = value;
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
        get checked() {
          return self.checked;
        },
        set checked(value) {
          if (value === self.checked) {
            return;
          }
          self.checked = value;
        },
        get border() {
          return self.border;
        },
        set border(value) {
          if (value === self.border) {
            return;
          }
          self.border = value;
        },
      } as unknown as ISchema,
    });
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "q-radio": QRadio;
  }
}
