import { css, html, unsafeCSS, PropertyValueMap } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { ISchema, EComponentType, EComponentGroup } from "../../types/runtime/IModelSchema";
import { Component } from "../../types/runtime/Component";
import { createVueComponent } from "./component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import antdCss from "ant-design-vue/dist/antd.min.css?inline";
import cssIndex from "./index.scss?inline?inline";
import { IMessage } from "../../types/runtime/IMessage";
import { btnType, drawerStyleType } from "./IQDrawer";
import { booleanTransform, unmountInstance } from "../../util/utils";

/**
 * 折叠面板
 */
@customElement("q-drawer")
export class QDrawer extends Component {
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

  // 抽屉方向
  @property({ type: String })
  public placement = "右";
  // 抽屉大小
  @property({ type: String })
  public size = "小";
  // 抽屉宽度
  @property({ type: String })
  public mWidth = "378";
  // 抽屉高度
  @property({ type: Number })
  public mHeight = 920;

  // 遮罩 mask 是否启用
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public mask = true;

  // 点击 mask 是否关闭
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public maskClosable = true;

  // 关闭图标
  @property({ type: Object }) // closable
  public closeData: any = {
    enable: true,
    icon: "",
  };
  // 是否启用头部
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public headEnable = true;

  // 标题
  @property({ type: String })
  title = "抽屉标题";
  // 标题图标
  @property({ type: String })
  icon = "";

  // 是否启用底部
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public footEnable = true;

  // 操作按钮
  @property({ type: Array })
  public operation: Array<btnType> = [
    {
      label: "确定", // 按钮文字
      type: "默认", // 按钮风格
      func: "确定", // 点击按钮后触发的父组件事件
    },
    {
      label: "取消", // 按钮文字
      type: "简约", // 按钮风格
      disabled: false, // 按钮可用
      loading: false, // 按钮加载
      func: "取消", // 点击按钮后触发的父组件事件
    },
  ];

  // 抽屉局部设置
  @property({ type: Object })
  public drawerStyle: drawerStyleType = {
    drawerWrapperStyle: "background-color: #ffffff;",
    contentWrapperStyle: "background-color: #ffffff;",
    headerStyle: "",
    bodyStyle: "",
    footerStyle: "",
  };

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

  // 命令抽屉
  // @property({ type: Object })  // closable
  // public Drawer: any = {
  //   info: this.componentInstance._instance.setupState.Drawer.info,
  //   success: this.componentInstance._instance.setupState.Drawer.success,
  //   error: this.componentInstance._instance.setupState.Drawer.error,
  //   warning: this.componentInstance._instance.setupState.Drawer.warning,
  //   confirm: this.componentInstance._instance.setupState.Drawer.confirm,
  //   dialog: (option = {}) => {
  //     createVueComponent({...this, ...option}, "cmd");
  //   },
  // }
  
  // 处理显隐状态
  visibleHandleFun(visible: boolean) {
    this.visible = visible;
    this.requestUpdate("visible");
    if (!this.contextType && visible) {
      const autoDropzone = document.querySelector(".auto-size-inner-dropzone") as HTMLElement;
      if (autoDropzone) {
        const scrollWidth = autoDropzone.scrollWidth;
        const offsetWidth = autoDropzone.offsetWidth;
        const scrollHeight = autoDropzone.scrollHeight;
        const offsetHeight = autoDropzone.offsetHeight;
        switch (this.placement) {
          case "上":
            autoDropzone.scrollTop = 0;
            break;
          case "右":
            autoDropzone.scrollLeft = scrollWidth - offsetWidth;
            break;
          case "下":
            autoDropzone.scrollTop = scrollHeight - offsetHeight;
            break;
          case "左":
            autoDropzone.scrollLeft = 0;
            break;

          default:
            autoDropzone.scrollLeft = scrollWidth - offsetWidth;
            break;
        }
      }
    }
    // const autoDropzone = document.querySelector(".auto-size-inner-dropzone") as HTMLElement;
    // if (visible) {
    //   if (autoDropzone) {
    //     autoDropzone.scrollTop = 0;
    //     autoDropzone.style.overflow = "hidden";
    //   }
    // } else {
    //   if (autoDropzone) autoDropzone.style.overflow = "auto"
    // }
  }
  // 拖入面板
  dropCreated(DragDrop: any) {
    console.log("dropCreated");
    document.querySelectorAll(".draggable2").forEach((el: any) => {
      if (el.dataset["elementType"] === "q-drawer") el.visible = false;
    });
    this.classList.add("nodraggable");
    this.visibleHandleFun(true);
  }
  // 渲染模板
  render() {
    return html`
      <div id="container" class="q-drawer-container"></div>
    `;
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
    if (!this.componentInstance && this.container) {
      createVueComponent(this);
    }
  }

// 首次更新
  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    console.log(_changedProperties);
    // changedProperties.forEach(function (value, key, map) {
    //     console.log(key)
    // })
    if (this.container) {
      unmountInstance(this);
      createVueComponent(this);
    }
  }
  // 更新
  protected updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    const _this = this;
    if (this.componentInstance) {
      changedProperties.forEach(function (value, key, map) {
        console.log(key);
        if (value !== undefined) _this.componentInstance._instance.setupState[key] = _this[key];
      });
    }
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-drawer";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "抽屉容器";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "抽屉容器组件,用于组建抽屉容器的内容";
          },
          get changeSetter() {
            return ["attribute", "style", "event"];
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "弹出抽屉",
                eventType: "openDrawer",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "关闭抽屉",
                eventType: "closeDrawer",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "确定",
                eventType: "Confirm",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "取消",
                eventType: "Cancel",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "自定义事件",
                eventType: "CustomEvent",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "自定义事件",
                eventType: "AfterClose",
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
                visible: {
                  type: "boolean",
                  description: "默认弹出",
                },
                mWidth: {
                  type: "string",
                  description: "内容宽度",
                },
                mHeight: {
                  type: "number",
                  description: "内容高度",
                },
                size: {
                  type: "string",
                  description: "抽屉尺寸",
                  enum: ["大", "中", "小", "自定义"],
                },
                placement: {
                  type: "string",
                  description: "抽屉方向",
                  enum: ["上", "右", "下", "左"],
                },
                mask: {
                  type: "boolean",
                  description: "显示遮罩",
                },
                maskClosable: {
                  type: "boolean",
                  description: "遮罩关闭",
                },
                closeData: {
                  type: "object",
                  description: "关闭图标",
                  properties: {
                    enable: {
                      type: "boolean",
                      description: "是否显示",
                    },
                    icon: {
                      type: "string",
                      description: "图标",
                      format: "resource",
                    },
                  },
                },
                headEnable: {
                  type: "boolean",
                  description: "启用头部",
                },
                title: {
                  type: "string",
                  description: "标题",
                },
                icon: {
                  type: "string",
                  description: "图标",
                  format: "resource",
                },
                footEnable: {
                  type: "boolean",
                  description: "启用底部",
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
                        enum: ["默认", "简约", "虚边", "文字", "链接"],
                      },
                      func: {
                        type: "string",
                        description: "操作",
                        enum: ["确定", "取消", "自定义"],
                      },
                    },
                  },
                },
                drawerStyle: {
                  type: "object",
                  description: "抽屉样式",
                  properties: {
                    drawerWrapperStyle: {
                      type: "string",
                      description: "外层样式",
                      format: "style",
                    },
                    contentWrapperStyle: {
                      type: "string",
                      description: "包裹内容部分样式",
                      format: "style",
                    },
                    headerStyle: {
                      type: "string",
                      description: "头部样式",
                      format: "style",
                    },
                    bodyStyle: {
                      type: "string",
                      description: "内容部分样式",
                      format: "style",
                    },
                    footerStyle: {
                      type: "string",
                      description: "底部样式",
                      format: "style",
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
        _initStyle: "position: absolute;width:0px;height:0px;left: 0px;top: 0px;z-index:2999",
        get initStyle() {
          // @ts-ignore
          return this._initStyle;
        },
        set initStyle(value) {
          // @ts-ignore
          self.style.cssText = this._initStyle;
        },
        _onMessageMeta: {
          openDrawer: [
            (e: IMessage) => {
              console.log("openDrawer", e.body);
              // const _this = this.el;
              // @ts-ignore
              this.el.visible = true;
              // @ts-ignore
              this.el.requestUpdate("visible");
            },
          ],
          closeDrawer: [
            (e: IMessage) => {
              console.log("closeDrawer", e);
              // @ts-ignore
              const _this = this.el;
              _this.visible = false;
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
          console.log(value);
          self.size = value;
          self.requestUpdate("size");
        },
        get mWidth() {
          return self.mWidth;
        },
        set mWidth(value) {
          console.log(value);
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
        get closeData() {
          return self.closeData;
        },
        set closeData(value) {
          self.closeData = value;
          self.requestUpdate("closeData");
        },
        get placement() {
          return self.placement;
        },
        set placement(value) {
          self.placement = value;
          if (!self.contextType && self.visible) {
            const autoDropzone = document.querySelector(".auto-size-inner-dropzone") as HTMLElement;
            if (autoDropzone) {
              const scrollWidth = autoDropzone.scrollWidth;
              const offsetWidth = autoDropzone.offsetWidth;
              const scrollHeight = autoDropzone.scrollHeight;
              const offsetHeight = autoDropzone.offsetHeight;
              switch (self.placement) {
                case "上":
                  autoDropzone.scrollTop = 0;
                  autoDropzone.scrollLeft = 0;
                  break;
                case "右":
                  autoDropzone.scrollTop = 0;
                  autoDropzone.scrollLeft = scrollWidth - offsetWidth;
                  break;
                case "下":
                  autoDropzone.scrollLeft = 0;
                  autoDropzone.scrollTop = scrollHeight - offsetHeight;
                  break;
                case "左":
                  autoDropzone.scrollTop = 0;
                  autoDropzone.scrollLeft = 0;
                  break;

                default:
                  autoDropzone.scrollTop = 0;
                  autoDropzone.scrollLeft = scrollWidth - offsetWidth;
                  break;
              }
            }
          }
          self.requestUpdate("placement");
        },
        get headEnable() {
          return self.headEnable;
        },
        set headEnable(value) {
          self.headEnable = value;
          self.requestUpdate("headEnable");
        },
        get title() {
          return self.title;
        },
        set title(value) {
          self.title = value;
          self.requestUpdate("title");
        },
        get icon() {
          return self.icon;
        },
        set icon(value) {
          self.icon = value;
          self.requestUpdate("icon");
        },
        get footEnable() {
          return self.footEnable;
        },
        set footEnable(value) {
          self.footEnable = value;
          self.requestUpdate("footEnable");
        },
        get operation() {
          return self.operation;
        },
        set operation(value) {
          self.operation = value;
          self.requestUpdate("operation");
        },
        get drawerStyle() {
          return self.drawerStyle;
        },
        set drawerStyle(value) {
          self.drawerStyle = value;
          self.requestUpdate("drawerStyle");
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-drawer": QDrawer;
  }
}
