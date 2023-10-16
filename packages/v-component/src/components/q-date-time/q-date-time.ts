import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { extractClass } from "../../common";
import { Component } from "../../types/runtime/Component";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform, sendFormMsg } from "../../util/utils";
import cssIndex from "./index.scss?inline";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { isEqual } from "lodash-es";
import { IMessage } from "../../types/runtime/IMessage";
import { changeProperty } from "../../types/runtime/decorators/decorators";
type typeEnum = "time" | "date" | "month" | "datetime-local" | "week";

@customElement("q-date-time")
export class QDateTime extends Component {
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
  @changeProperty()
  @property({ type: String })
  public value: string | number = "";

  /**
   * 纪记录默认值
   */
  @changeProperty()
  @property({ type: String })
  public defaultValue = "";

  @property({ type: String })
  public name = "QDateTime";

  @property({ type: String })
  public type: typeEnum = "date";

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public disabled = false;

  public max = "";

  /**
   * 改变事件
   */
  public changeEvent(e: Event) {
    if (this.disabled) return;
    const inputEle = this.shadowRoot?.querySelector(".q-date-time_input") as HTMLInputElement;
    this.value = inputEle.value;
    this.onSendMessage("change");
    DOMEmit(this, "change", { detail: { value: this.value } });
  }

  public changeMax() {
    switch (this.type) {
      case "date":
        this.max = "3000-12-31";
        break;
      case "month":
        this.max = "3000-12";
        break;
      case "datetime-local":
        this.max = "3000-12-31 23:59";
        break;
      case "week":
        this.max = "3000-W52";
        break;
      case "time":
        this.max = "23:59";
        break;
      default:
        break;
    }
  }

  /**
   * 数据重置
   */
  public resetValue() {
    this.value = this.defaultValue;
    this.requestUpdate()
  }

  /**
   * 设置value值
   */
  public setValue(value: string | number) {
    this.value = value;
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

  public render() {
    this.changeMax();
    return html`
      <div
        class=${extractClass({}, "q-date-time", {
          "is-disabled": this.disabled,
        })}
      >
        <div class="q-date-time_inner">
          ${this.disabled
            ? html`
                <input
                  type=${this.type}
                  disabled
                  value=${this.value}
                  style="cursor: not-allowed;pointer-events: none;"
                />
              `
            : html`
                <input
                  type=${this.type}
                  class="q-date-time_input"
                  value=${this.value}
                  @change=${this.changeEvent.bind(this)}
                />
              `}
        </div>
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
            return "q-date-time";
          },
          get type() {
            return EComponentType.FROM;
          },
          get text() {
            return "时间选择器";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "用于时间选择";
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
                text: "组件数据变更",
                eventType: "change",
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
                  description: "当前日期",
                },
                defaultValue: {
                  type: "string",
                  description: "默认日期",
                },
                name: {
                  type: "string",
                  description: "选项名称",
                },
                type: {
                  type: "string",
                  description:
                    "日期类型(可选 date 3000-12-31 | month 3000-12 | datetime-local 3000-12-31 23:59 | week 3000-W52 | time 23:59)",
                },
                disabled: {
                  type: "boolean",
                  description: "是否禁用",
                },
                max: {
                  type: "string",
                  description: "最大日期",
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
        _initStyle: "height:28px;width:150px;background-color:#ffffff;color:#000000",
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
        get name() {
          return self.name;
        },
        set name(value) {
          if (value === self.name) {
            return;
          }
          self.name = value;
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
        get disabled() {
          return self.disabled;
        },
        set disabled(value) {
          if (value === self.disabled) {
            return;
          }
          self.disabled = value;
        },
        get max() {
          return self.max;
        },
        set max(value) {
          if (value === self.max) {
            return;
          }
          self.max = value;
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
    sendFormMsg(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-date-time": QDateTime;
  }
}
