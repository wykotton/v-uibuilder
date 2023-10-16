import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform, sendFormMsg } from "../../util/utils";
import cssIndex from "./index.scss?inline";
import "../q-checkbox/q-checkbox";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { cloneDeep, isArray, isEqual } from "lodash-es";
import { IMessage } from "../../types/runtime/IMessage";

type UISize = "large" | "default" | "small";

@customElement("q-checkbox-group")
export class QCheckboxGroup extends Component {
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

  @property({ type: String })
  public name = "QCheckboxGroup";

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

  @property({ type: Array, reflect: true })
  public value = [] as string[];

  @property({ type: Array, reflect: true })
  public defaultValue = [] as string[];

  @property({ type: Array })
  public options = [
    {
      label: "复选框1",
      value: "1",
      size: "small",
      disabled: false,
      border: false,
      name: "复选框",
    },
    {
      label: "复选框2",
      value: "2",
      size: "small",
      disabled: false,
      border: false,
      name: "复选框",
    },
    {
      label: "复选框3",
      value: "3",
      size: "small",
      disabled: false,
      border: false,
      name: "复选框",
    },
  ];

  /**
   * 值修改
   * @param value
   */
  public handleChange(ev: CustomEvent) {
    try {
      const detail = ev.detail;
      let tempValue = cloneDeep(this.value);
      if (ev.detail.checked) {
        tempValue.includes(detail.value) ? void 0 : tempValue.push(detail.value);
      } else {
        tempValue = tempValue.filter((item) => item !== detail.value);
      }
      this.componentModel.model.value = JSON.stringify(tempValue);
    } catch (error) {}
    this.onSendMessage("change");
    sendFormMsg(this);
    DOMEmit(this, "change", { detail: { value: this.value } });
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
  public setValue(value: []) {
    this.componentModel.model.value = value;
  }

  /**
   *
   */
  handleFocus() {
    this.onSendMessage("onFocus");
  }
  handleBlur() {
    this.onSendMessage("onBlur");
  }
  public render() {
    return html`
      <div class="q-checkbox-group" role="group" aria-label="checkbox-group">
        ${this.options.map((item: any) => {
          return html`
            <q-checkbox
              label=${item.label}
              value=${item.value}
              size=${item.size || this.size}
              disabled=${item.disabled || this.disabled}
              border=${item.border || this.border}
              checked=${this.value.includes(item.value)}
              indeterminate=${item.indeterminate}
              name=${item.name}
              @onFocus=${this.handleFocus.bind(this)}
              @onBlur=${this.handleBlur.bind(this)}
              @change=${this.handleChange.bind(this)}
              style="font-size: inherit;color: inherit"
            ></q-checkbox>
          `;
        })}
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
            return "q-checkbox-group";
          },
          get type() {
            return EComponentType.FROM;
          },
          get text() {
            return "复选框组";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "用于在选中和非选中状态之间进行切换";
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
            ],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                value: {
                  type: "string",
                  description: "复选框选中数据",
                },
                defaultValue: {
                  type: "string",
                  description: "默认选中数据",
                },
                name: {
                  type: "string",
                  description: "标识",
                },
                options: {
                  type: "array",
                  description: "选项卡数据",
                  items: {
                    type: "object",
                    description: "子项数据",
                    properties: {
                      label: {
                        type: "string",
                        description: "选项名称",
                      },
                      value: {
                        type: "string",
                        description: "选项值",
                      },
                      disabled: {
                        type: "boolean",
                        description: "是否禁用",
                      },
                      size: {
                        type: "string",
                        description: "尺寸,只在有包含边框时生效",
                        enum: ["small", "medium", "mini"],
                      },
                      border: {
                        type: "boolean",
                        description: "是否包含边框",
                      },
                      name: {
                        type: "string",
                        description: "可设置 checkbox 元素的 name ",
                      },
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
              Array.isArray(e.body) && (this.value = e.body);
            },
          ],
        },
        _onDOMEvent: {},
        _initStyle: "height:28px;width:260px;",
        _onWatchSetting: {
          value: [
            function (newVal: any, oldVal: any, context: any) {
              // @ts-ignore
              self.onSendMessage("change");
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
        get options() {
          return self.options;
        },
        set options(value) {
          if (!isArray(value) || isEqual(value, self.options)) return;
          self.options = value;
        },
        get value() {
          return JSON.stringify(self.value);
        },
        set value(value) {
          try {
            const tempValue = Array.isArray(value) ? value : JSON.parse(value);
            if (Array.isArray(tempValue)) {
              self.value = tempValue;
            }
          } catch (error) {
            console.log(error);
          }
        },
        get defaultValue() {
          return JSON.stringify(self.value);
        },
        set defaultValue(value) {
          try {
            self.defaultValue = JSON.parse(value);
          } catch (e) {}
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

  onSendMessage(type: string) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: type,
        dstType: "",
      },
      body: this.value,
    };
    this.componentModel.sendMessage(message);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-checkbox-group": QCheckboxGroup;
  }
}
