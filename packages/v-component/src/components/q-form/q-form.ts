import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { choose } from "lit/directives/choose.js";
import { isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { Component } from "../../types/runtime/Component";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform } from "../../util/utils";
import "../q-button/q-button";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import cssIndex from "./index.scss?inline";
import "../q-container-mask/q-container-mask";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import { createHash } from "../../util/utils";

@customElement("q-form")
export class QForm extends Component {
  constructor() {
    super();
    this.initModel();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `
  ];

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  @changeProperty()
  @property({ type: Object })
  public value = {};

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    }
  })
  public disabled = false;

  /**
   * 是否显示提交按钮
   */
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    }
  })
  public showSubmitBtn = false;

  /**
   * 提交按钮类型
   */
  @property({ type: String })
  public submitType = "primary";

  /**
   * 提交按钮样式
   */
  @property({ type: String })
  public submitStyle = "height: 28px; position: relative;";

  /**
   * 提交按钮文字
   */
  @property({ type: String })
  public submitText = "提交";

  /**
   * 是否显示重置按钮
   */
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    }
  })
  public showResetBtn = false;

  /**
   * 重置按钮类型
   */
  @property({ type: String })
  public resetType = "info";

  /**
   * 重置按钮样式
   */
  @property({ type: String })
  public resetStyle = "height: 28px; position: relative;";

  /**
   * 重置按钮文字
   */
  @property({ type: String })
  public resetText = "重置";

  @query("#q-form-slot")
  public slotRef!: HTMLSlotElement;

  /**
   * 获取子组件表单
   */
  public getChildDom() {
    return this.slotRef
      ?.assignedNodes()
      .filter((item) => (item as any).tagName && (item as any).tagName.indexOf("Q-") !== -1);
  }

  /**
   * 重置表单数据
   */
  public resetFormData() {
    const slotDOM = this.getChildDom();
    if (!this.disabled) {
      (slotDOM || []).forEach((el: any) => {
        if (el.resetValue) el.resetValue();
      });
    }
    // this.getFormData()
  }

  /**
   * 设置子组件表单值
   */
  public setFormData(formData: {}) {
    (this.getChildDom() || []).forEach((el: any) => {
      if (el.setValue) el.setValue(formData[el.name]);
    });
  }

  public getFormData(type = "throwFormData", tirgger?: string) {
    // 开启点击按钮则禁用掉值改变传值
    if (this.showSubmitBtn && tirgger && tirgger === "valueChange") return;
    const slotDOM = this.getChildDom();
    const jsonData = {};
    if (!this.disabled) {
      (slotDOM || []).forEach((el: any) => {
        if (!el.disabled && el.name) {
          jsonData[el.name] = el.value;
        }
      });
    }
    this.value = jsonData;
    this.onSendMessage(type);
    DOMEmit(this, "submit", { detail: { value: jsonData } });
    return jsonData;
  }

  attributeChangedCallback() {
    console.log("attributeChangedCallback");
  }

  public render() {
    return html`
      <div class="q-form">
        <div class="q-form-content">
          <slot id="q-form-slot" class="dropzone">
            <q-container-mask text="组件降落区"></q-container-mask>
          </slot>
        </div>
      </div>
      ${choose(this.showResetBtn, [
        [
          true,
          () => html`
            <q-button
              class="draggable2"
              id=${"Q-BUTTON" + createHash()}
              data-element-type="Q-BUTTON"
              style="${this.resetStyle}"
              text="${this.resetText}"
              @click="${(e: MouseEvent) => this.resetFormData()}"
              type="${this.resetType}"
            ></q-button>
          `
        ],
        [false, () => html``]
      ])}
      ${choose(this.showSubmitBtn, [
        [
          true,
          () => html`
            <q-button
              class="draggable2"
              id=${"Q-BUTTON" + createHash()}
              data-element-type="Q-BUTTON"
              type="${this.submitType}"
              @click="${(e: MouseEvent) => this.getFormData()}"
              style="${this.submitStyle}"
              text="${this.submitText}"
            ></q-button>
          `
        ],
        [false, () => html``]
      ])}
    `;
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-form";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "表单容器";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "表单容器组件,可以管理表单内容";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "获取表单数据",
                eventType: "getFormData",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "重置表单数据",
                eventType: "resetFormData",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "设置表单数据",
                eventType: "setFormData",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "抛出表单数据",
                eventType: "triggerThrowFormData",
                messageSchema: "",
                messageDemo: ""
              }
            ],
            outputMessage: [
              {
                text: "抛出表单数据",
                eventType: "throwFormData",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "外部触发抛出表单数据",
                eventType: "triggerThrowFormData",
                messageSchema: "",
                messageDemo: ""
              }
            ]
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                value: {
                  type: "string",
                  description: "表单值",
                  disabled: true
                },
                disabled: {
                  type: "boolean",
                  description: "禁用表单"
                },
                showSubmitBtn: {
                  type: "boolean",
                  description: "显示提交按钮"
                },
                submitType: {
                  type: "string",
                  description: "提交按钮类型"
                },
                submitStyle: {
                  type: "string",
                  description: "提交按钮样式",
                  format: "style"
                },
                submitText: {
                  type: "string",
                  description: "提交按钮文字"
                },
                showResetBtn: {
                  type: "boolean",
                  description: "显示重置按钮"
                },
                resetType: {
                  type: "string",
                  description: "重置按钮类型"
                },
                resetStyle: {
                  type: "string",
                  description: "重置按钮样式",
                  format: "style"
                },
                resetText: {
                  type: "string",
                  description: "重置按钮文字"
                }
              }
            }
          }
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
          getFormData: [
            function(e: IMessage) {
              // @ts-ignore
              this.getFormData();
            }
          ],
          resetFormData: [
            function(e: IMessage) {
              // @ts-ignore
              this.resetFormData();
            }
          ],
          setFormData: [
            function(e: IMessage) {
              // @ts-ignore
              this.setFormData(e.body);
            }
          ],
          triggerThrowFormData: [
            function(e: IMessage) {
              // @ts-ignore
              this.getFormData("triggerThrowFormData");
            }
          ],
        },
        _onDOMEvent: {},
        _initStyle: "height:300px;width:300px;background-color:#ffffff",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function() {
          },
          updated: function() {
          },
          destroy: function() {
          }
        },
        get disabled() {
          return self.disabled;
        },
        set disabled(value) {
          self.disabled = value;
        },
        get value() {
          return JSON.stringify(self.value);
        },
        set value(value) {
          try {
            self.value = JSON.parse(value);
          } catch (e) {
          }
        },
        get showSubmitBtn() {
          return self.showSubmitBtn;
        },
        set showSubmitBtn(value) {
          self.showSubmitBtn = value;
        },
        get showResetBtn() {
          return self.showResetBtn;
        },
        set showResetBtn(value) {
          self.showResetBtn = value;
        },
        get submitType() {
          return self.submitType;
        },
        set submitType(value) {
          self.submitType = value;
        },
        get submitStyle() {
          return self.submitStyle;
        },
        set submitStyle(value) {
          self.submitStyle = value;
        },
        get submitText() {
          return self.submitText;
        },
        set submitText(value) {
          self.submitText = value;
        },
        get resetType() {
          return self.resetType;
        },
        set resetType(value) {
          self.resetType = value;
        },
        get resetStyle() {
          return self.resetStyle;
        },
        set resetStyle(value) {
          self.resetStyle = value;
        },
        get resetText() {
          return self.resetText;
        },
        set resetText(value) {
          self.resetText = value;
        }
      } as unknown as ISchema
    });
  }

  onSendMessage(type: string) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: type,
        dstType: ""
      },
      body: this.value
    };
    this.componentModel.sendMessage(message);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-form": QForm;
  }
}