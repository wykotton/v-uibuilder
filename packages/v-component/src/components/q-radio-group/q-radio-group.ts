import { css, html, unsafeCSS } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform, sendFormMsg } from "../../util/utils";
import { QRadio } from "../q-radio/q-radio";
import cssIndex from "./index.scss?inline";
import "../q-radio/q-radio";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { isArray, isEqual } from "lodash-es";
import { IMessage } from "../../types/runtime/IMessage";

type UISize = "medium" | "small" | "mini";

@customElement("q-radio-group")
export class QRadioGroup extends Component {
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

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public disabled = false;

  @property({ type: String })
  public value: string | number = "";

  @property({ type: String })
  public defaultValue = "";

  @property({ type: String })
  public name = "QRadioGroup";

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public border = false;

  @property({ type: Array })
  public options = [
    {
      label: "单选框1",
      value: "1",
      size: "small",
      disabled: false,
      border: false,
      name: "单选框",
    },
    {
      label: "单选框2",
      value: "2",
      size: "small",
      disabled: false,
      border: false,
      name: "单选框",
    },
    {
      label: "单选框3",
      value: "3",
      size: "small",
      disabled: false,
      border: false,
      name: "单选框",
    },
  ];

  @queryAll("q-radio")
  public radioRefs!: QRadio[];

  /**
   * 值修改
   * @param value
   */
  public handleChange(ev: CustomEvent) {
    try {
      this.componentModel.model.value = ev.detail.value;
    } catch (error) {}
    this.updateRadioList();
    sendFormMsg(this);
  }

  /**
   * 更新子项数据
   */
  public updateRadioList() {
    this.radioRefs.forEach((element) => {
      this.value === element.value ? (element.checked = true) : (element.checked = false);
    });
    this.onSendMessage();
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
  public setValue(value: string | number) {
    this.componentModel.model.value = value;
  }

  public render() {
    return html`
      <div class="q-radio-group" role="group" aria-label="radio-group">
        ${this.options.map((item: any) => {
          return html`
            <q-radio
              label=${item.label}
              value=${item.value}
              size=${item.size || this.size}
              disabled=${item.disabled || this.disabled}
              border=${item.border || this.border}
              checked=${this.value === item.value}
              @change=${this.handleChange.bind(this)}
              style="font-size: inherit;color: inherit"
            ></q-radio>
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
            return "q-radio-group";
          },
          get type() {
            return EComponentType.FROM;
          },
          get text() {
            return "单选框组";
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
                text: "抛出数据",
                eventType: "throwFormData",
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
                  description: "单选框选中数据",
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
                        description: "可设置 radio 元素的 name ",
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
              this.resetValue();
            },
          ],
        },
        _onDOMEvent: {},
        _initStyle: "height:28px;width:260px;",
        _onWatchSetting: {
          value: [
            function (newVal: any, oldVal: any, context: any) {
              self.onSendMessage();
            },
          ],
        },
        _lifeCycle: {
          created: function () {},
          updated: function () {
            console.log("update");
          },
          destroy: function () {},
        },
        get options() {
          return self.options;
        },
        set options(value) {
          if (!isArray(value) || isEqual(value, self.options)) return;
          self.options = value;
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
        get name() {
          return self.name;
        },
        set name(value) {
          self.name = value;
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
    "q-radio-group": QRadioGroup;
  }
}
