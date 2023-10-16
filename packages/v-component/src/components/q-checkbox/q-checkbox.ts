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

@customElement("q-checkbox")
export class QCheckbox extends Component {
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
  public size: UISize = "small";

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
  public border = false;

  @property({ type: String })
  public value = "1";

  @property({ type: String })
  public label = "复选框";

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public checked = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public indeterminate = false;

  @property({ type: String })
  public name = "QCheckbox";

  public inputFocus: Boolean = false;

  public onFocus() {
    this.inputFocus = true;
  }

  public onBlur() {
    this.inputFocus = false;
  }

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
      name: this.name || "QCheckbox",
    };
    DOMEmit(this, "change", { detail: detail });
  }

  public render() {
    return html`
      <label
        class=${extractClass({}, "q-checkbox", {
          ["q-checkbox-" + this.size]: this.size && this.border,
          "is-disabled": this.disabled,
          "is-bordered": this.border,
          "is-checked": this.checked,
        })}
        style="font-size: inherit;color: inherit"
        id=${this.id}
        @click=${this.handleChange.bind(this)}
      >
        <div
          class=${extractClass({}, "q-checkbox_input", {
            "is-disabled": this.disabled,
            "is-bordered": this.border,
            "is-checked": this.checked,
            "is-indeterminate": this.indeterminate,
            "is-focus": this.inputFocus,
          })}
          tabindex=${this.indeterminate ? 0 : false}
          role=${this.indeterminate ? "checkbox" : false}
          aria-checked=${this.indeterminate ? "mixed" : false}
        >
          <span class="q-checkbox_inner"></span>
          <input
            class="q-checkbox_original"
            type="checkbox"
            aria-hidden=${this.indeterminate ? "true" : "false"}
            disabled=${this.disabled}
            value=${this.label}
            name=${this.name}
            @focus=${this.onFocus.bind(this)}
            @blur=${this.onBlur.bind(this)}
          />
        </div>
        <div class="q-checkbox_label">
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
            return "q-checkbox";
          },
          get type() {
            return EComponentType.FROM;
          },
          get text() {
            return "复选框";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "用于在选中和非选中状态之间进行切换。";
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
                size: {
                  type: "string",
                  description: "尺寸( medium | small | mini),只在有 border 时生效",
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
        _onWatchSetting: {},
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
        testStyle: "width:100px;height:200px;background-color:rgba(3,169,244,0.8)",
        testDate: "2022-09-14",
        testDateTime: "2022-09-14 15:50:00",
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-checkbox": QCheckbox;
  }
}
