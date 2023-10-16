import { customHasElement } from "../../types/runtime/decorators/decorators";
import { css, html, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { extractClass } from "../../common";
import { Component } from "../../types/runtime/Component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform, sendFormMsg } from "../../util/utils";
import "../q-button/q-button";
import "../q-color-panel/q-color-panel";
import "../q-popover/q-popover";
import { QPopover } from "../q-popover/q-popover";
import cssIndex from "./index.scss?inline";

@customHasElement("q-color-picker")
export class QColorPicker extends Component {
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

  @property({ type: String, reflect: true })
  public value = "";

  @property({ type: String, reflect: true })
  public defaultValue = "";

  @property({ type: String })
  public name = "QColor";

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public disabled = false;

  @query("#popover")
  public popoverRef!: QPopover;

  @query(".color-panel")
  public colorPanel!: HTMLElement;

  // 内|部临时颜色值
  public tempValue = "";

  /**
   * 改变颜色
   */
  public changeEvent(ev: CustomEvent) {
    if (this.disabled) return;
    this.tempValue = ev.detail.value;
  }

  // 确定
  public handleOk() {
    this.onSendMessage("change");
    this.onSendMessage("throwFormData");
    DOMEmit(this, "change", { detail: { value: this.tempValue } });
    this.value = this.tempValue;
    Promise.resolve().then(() => {
      this.popoverRef?.leave?.();
    });
  }

  // 取消
  public handleCancel() {
    this.tempValue = this.value;
    (this.colorPanel as any).value = this.value;
    Promise.resolve().then(() => {
      this.popoverRef?.leave?.();
    });
  }

  /**
   * 数据重置
   */
  public resetValue() {
    this.value = this.defaultValue;
  }

  /**
   * 设置value值
   */
  public setValue(value: string) {
    this.value = value;
  }

  public render() {
    this.tempValue = this.value;
    return html`
      <q-popover trigger="click" id="popover" disabled=${this.disabled} position="bottom">
        <div
          class=${extractClass({}, "color-btn", {
            "q-color-picker": true,
            "is-disabled": this.disabled,
          })}
          style="background-color: ${this.value}"
          id="color-btn"
          disabled=${this.disabled}
        >
          <span class="q-color-picker_inner"></span>
        </div>
        <div
          slot="popover"
          tip="popover"
          id="popcon"
          @mousedown=${(e: any) => {
            e.stopPropagation();
          }}
          @click=${(e: any) => {
            e.stopPropagation();
          }}
        >
          <q-color-panel class="color-panel" value=${this.value} @change=${this.changeEvent}></q-color-panel>
          <div class="pop-footer">
            <q-button type="text" @click=${this.handleCancel}>取 消</q-button>
            <q-button type="primary" id="btn-submit" @click=${this.handleOk}>确 认</q-button>
          </div>
        </div>
      </q-popover>
    `;
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-color-picker";
          },
          get type() {
            return EComponentType.FROM;
          },
          get text() {
            return "颜色选择器";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "用于颜色选择";
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
                  description: "选中颜色",
                },
                defaultValue: {
                  type: "string",
                  description: "默认颜色",
                },
                name: {
                  type: "string",
                  description: "名称",
                },
                disabled: {
                  type: "boolean",
                  description: "是否禁用",
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
        _initStyle: "height:28px;width:150px;",
        _onWatchSetting: {
          value: [
            function (newVal: any, oldVal: any, context: any) {
              // @ts-ignore
              this.onSendMessage("change");
              // @ts-ignore
              this.onSendMessage("throwFormData");
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
        get disabled() {
          return self.disabled;
        },
        set disabled(value) {
          if (value === self.disabled) {
            return;
          }
          self.disabled = value;
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
      body: this.tempValue,
    };
    this.componentModel.sendMessage(message);
    sendFormMsg(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-color-picker": QColorPicker;
  }
}
