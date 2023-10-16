import { css, html, PropertyValueMap, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { ISchema, EComponentType, EComponentGroup } from "../../types/runtime/IModelSchema";
import { Component } from "../../types/runtime/Component";
import { createVueComponent } from "./component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import antdCss from "ant-design-vue/dist/antd.min.css?inline";
import cssIndex from "./index.scss?inline?inline";
import { IMessage } from "../../types/runtime/IMessage";
import { modalType } from "./IQModal";
import { booleanTransform, unmountInstance } from "../../util/utils";


/**
 * 折叠面板
 */
@customElement("q-modal")
export class QModal extends Component {
  constructor() {
    super();
    this.initModel();
  }
  static styles = [
    css`
      ${unsafeCSS(antdCss)}
    `,
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  @property({ type: Boolean })
  public contextType = false;
  @property({ type: Boolean })
  public visible = false;

  // 弹窗大小
  @property({ type: String })
  public size = "中";
  // 弹窗宽度
  @property({ type: String })
  public mWidth = "50%";
  // 弹窗高度
  @property({ type: Number })
  public mHeight = 320;
  // 浮层的样式
  @property({ type: String })
  dialogStyle = "background-color: #ffffff;"

  // 遮罩 mask 是否启用
  @property({
    type: Boolean, converter(value, type?) {
      return booleanTransform(value);
    }
  })
  public mask = true

  // 点击 mask 是否关闭
  @property({
    type: Boolean, converter(value, type?) {
      return booleanTransform(value);
    }
  })
  public maskClosable = true

  // 关闭图标
  @property({ type: Object })  // closable
  public closeData: any = {
    color: "#00000073",
    enable: true,
    icon: ""
  }

  // 模态局部设置
  @property({ type: Object })  
  public modalData: modalType = {
    head: {
      enable: true,
      title: "模态标题",
      icon: "",
      headStyle: ""
    },
    body: {
      bodyStyle: "background-color: #ffffff;"
    },
    foot: {
      enable: true,
      operation: [{
        label: "确定", // 按钮文字
        type: "默认", // 按钮风格
        func: "确定", // 点击按钮后触发的父组件事件
      }, {
        label: "取消", // 按钮文字
        type: "简约", // 按钮风格
        disabled: false, // 按钮可用
        loading: false, // 按钮加载
        func: "取消", // 点击按钮后触发的父组件事件
      }],
      footStyle: ""
    }
  }

  /**
   * 挂载节点.
   */
  @query("#container")
  container!: HTMLElement;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  // 命令模态
  // @property({ type: Object })  // closable
  // public Modal: any = {
  //   info: this.componentInstance._instance.setupState.Modal.info,
  //   success: this.componentInstance._instance.setupState.Modal.success,
  //   error: this.componentInstance._instance.setupState.Modal.error,
  //   warning: this.componentInstance._instance.setupState.Modal.warning,
  //   confirm: this.componentInstance._instance.setupState.Modal.confirm,
  //   dialog: (option = {}) => {
  //     createVueComponent({...this, ...option}, "cmd");
  //   },
  // }

  visibleHandleFun(visible: boolean) {
    this.visible = visible
    this.requestUpdate("visible");
    const autoDropzone = document.querySelector(".auto-size-inner-dropzone") as HTMLElement;
    if (visible) {
      if (autoDropzone) {
        autoDropzone.scrollTop = 0;
        autoDropzone.style.overflow = "hidden";
      }
    } else {
      if (autoDropzone) autoDropzone.style.overflow = "auto"
    }
  }
  dropCreated(DragDrop: any) {
    console.log("dropCreated")
    document.querySelectorAll(".draggable2").forEach((el: any) => {
      if (el.dataset["elementType"] === "Q-MODAL") el.visible = false
    })
    this.classList.add("nodraggable");
    this.visibleHandleFun(true);
  }
  render() {
    return html`
      <div id="container" class="q-modal-container"></div>
    `;
    // 初始化数据
    // return this.visible ? html`
    //   <div id="container" class="q-modal-container"></div>
    // `: html`<div></div>`;
  }

  disconnectedCallback(): void {
    if (!this.isConnected) {
      // 断开文档连接，说明元件已被删除
      unmountInstance(this);
    }
    super.disconnectedCallback();
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    console.log(this.componentInstance)
    if (!this.componentInstance) {
      createVueComponent(this);
    }
  }
  // override async getUpdateComplete() {
  //   const result = await super.getUpdateComplete();
  //   console.log(this.container)
  //   debugger
  //   return result;
  // }

protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
  console.log(_changedProperties)
  // changedProperties.forEach(function (value, key, map) {
  //     console.log(key)
  // })
  if (this.container) {
    unmountInstance(this);
    createVueComponent(this);
  }
}
protected updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
  const _this = this;
  if (this.componentInstance) {
    changedProperties.forEach(function (value, key, map) {
      console.log(key)
      if (value !== undefined) _this.componentInstance._instance.setupState[key] = _this[key]
    })
  }
}

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-modal";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "模态容器";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "模态容器组件,用于组建模态容器的内容";
          },
          get changeSetter() {
            return ["attribute", "style", "event"]
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "弹出模态",
                eventType: "openModal",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "关闭模态",
                eventType: "closeModal",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "确定",
                eventType: "Confirm",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "取消",
                eventType: "Cancel",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "自定义事件",
                eventType: "CustomEvent",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "自定义事件",
                eventType: "AfterClose",
                messageSchema: "",
                messageDemo: ""
              },
            ]
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                visible: {
                  type: "boolean",
                  description: "默认弹出",
                },
                mWidth: {
                  type: "string",
                  description: "内容宽度"
                },
                mHeight: {
                  type: "number",
                  description: "内容高度"
                },
                size: {
                  type: "string",
                  description: "弹窗尺寸",
                  enum: ["大", "中", "小", "自定义"]
                },
                mask: {
                  type: "boolean",
                  description: "显示遮罩"
                },
                maskClosable: {
                  type: "boolean",
                  description: "遮罩关闭"
                },
                dialogStyle: {
                  type: "string",
                  description: "外层样式",
                  format: "style"
                },
                closeData: {
                  type: "object",
                  description: "关闭图标",
                  properties: {
                    color: {
                      type: "string",
                      description: "颜色",
                      format: "color"
                    },
                    enable: {
                      type: "boolean",
                      description: "是否显示"
                    },
                    icon: {
                      type: "string",
                      description: "图标",
                      format: "resource"
                    },
                  }
                },
                modalData: {
                  type: "object",
                  description: "模态局部控制",
                  properties: {
                    head: {
                      type: "object",
                      description: "头部控制",
                      properties: {
                        enable: {
                          type: "boolean",
                          description: "是否显示"
                        },
                        title: {
                          type: "string",
                          description: "标题文字",
                        },
                        icon: {
                          type: "string",
                          description: "标题图标",
                          format: "resource"
                        },
                        headStyle: {
                          type: "string",
                          description: "头部样式",
                          format: "style"
                        },
                      }
                    },
                    body: {
                      type: "object",
                      description: "中部控制",
                      properties: {
                        bodyStyle: {
                          type: "string",
                          description: "中部样式",
                          format: "style"
                        },
                      }
                    },
                    foot: {
                      type: "object",
                      description: "底部控制",
                      properties: {
                        enable: {
                          type: "boolean",
                          description: "是否显示"
                        },
                        footStyle: {
                          type: "string",
                          description: "底部样式",
                          format: "style"
                        },
                        operation: {
                          type: "array",
                          description: "操作项",
                          items: {
                            type: "object",
                            description: "按钮",
                            properties: {
                              label: {
                                type: "string",
                                description: "文字",
                              },
                              type: {
                                type: "string",
                                description: "风格",
                                enum: ["默认", "简约", "虚边", "文字", "链接"]
                              },
                              func: {
                                type: "string",
                                description: "操作",
                                enum: ["确定", "取消", "自定义"]
                              },
                            }
                          },
                        },
                      }
                    },
                  }
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
        _initStyle: "position: absolute;width:0px;height:0px;left: 0px;top: 0px;",
        get initStyle(){
          // @ts-ignore
          return this._initStyle;
        },
        set initStyle(value) {
          // @ts-ignore
          self.style.cssText = this._initStyle;
        },
        // get initStyle() {
        //   // @ts-ignore
        //   return this._initStyle;
        // },
        // set initStyle(value) {

        //   // @ts-ignore
        //   this._initStyle = value;
        //   self.setBackTopStyle(self.style.cssText)
        //   self.style.cssText = value;
        // }
        _onMessageMeta: {
          openModal: [
            (e: IMessage) => {
              console.log("openModal", e.body);
              // @ts-ignore
              const _this = this.el;
              _this.visibleHandleFun(true);
              _this.requestUpdate("visible");
            },
          ],
          closeModal: [
            (e: IMessage) => {
              console.log("closeModal", e);
              // @ts-ignore
              const _this = this.el;
              _this.visibleHandleFun(false);
              _this.requestUpdate("visible");
            },
          ],
        },

        _onDOMEvent: {},
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

        publicAPI: {
          // moveableOptions
          // dragDrop
          moveable: {
            drag: function (e: DragEvent) {
              // console.log(e)
            },
            dragEnd: function (e: DragEvent) {
              // console.log(e)
            },
            setMoveableTarget: function (arg: IArguments) {
              console.log("setMoveableTarget", arg);
              // arg[1].moveableTop.updateRect()
              return false;
            },
          },
        },
        get contextType() {
          // @ts-ignore
          return this._contextType;
        },
        set contextType(value) {
          // @ts-ignore
          this._contextType = value;
          self.contextType = value;
          self.requestUpdate("contextType");
        },
        get visible() {
          return self.visible;
        },
        set visible(value) {
          self.visible = value;
          self.requestUpdate("visible");
        },
        get size() {
          return self.size;
        },
        set size(value) {
          console.log(value)
          self.size = value;
          self.requestUpdate("size");
        },
        get mWidth() {
          return self.mWidth;
        },
        set mWidth(value) {
          console.log(value)
          self.mWidth = value;
          self.requestUpdate("mWidth");
        },
        get mHeight() {
          return self.mHeight;
        },
        set mHeight(value) {
          self.mHeight = value;
          self.requestUpdate("mHeight");
        },
        get mask() {
          return self.mask;
        },
        set mask(value) {
          self.mask = value;
          self.requestUpdate("mask");
        },
        get maskClosable() {
          return self.maskClosable;
        },
        set maskClosable(value) {
          self.maskClosable = value;
          self.requestUpdate("maskClosable");
        },
        get dialogStyle() {
          return self.dialogStyle;
        },
        set dialogStyle(value) {
          self.dialogStyle = value;
          self.requestUpdate("dialogStyle");
        },
        get closeData() {
          return self.closeData;
        },
        set closeData(value) {
          self.closeData = value;
          self.requestUpdate("closeData");
        },
        get modalData() {
          return self.modalData;
        },
        set modalData(value) {
          self.modalData = value;
          self.requestUpdate("modalData");
        },
        

      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-modal": QModal;
  }
}
