import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { ISchema, EComponentType, EComponentGroup } from "../../types/runtime/IModelSchema";
import { Component } from "../../types/runtime/Component";
import { createVueComponent } from "./component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import antdCss from "ant-design-vue/dist/antd.min.css?inline";
import cssIndex from "./index.scss?inline?inline";
import { IMessage } from "../../types/runtime/IMessage";
import { Appearance } from "./IQCollapse";
import { unmountInstance } from "../../util/utils";

/**
 * 折叠面板
 */
@customElement("q-collapse")
export class QCollapse extends Component {
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

  /**
   * 折叠数据 datalist
   */
  @property({ type: Array, attribute: "datalist" })
  datalist = [
    {
      key: "1",
      label: "默认标题1",
      bgcolor: "#ffffff",
      disabled: false,
      actived: true,
      showArrow: true,
    },
    {
      key: "2",
      label: "默认标题2",
      bgcolor: "#ffffff",
      disabled: false,
      actived: false,
      showArrow: true,
    },
  ];
  /**
   * 默认激活项 activeKey
   */
  @property({ type: Array, attribute: "active-key" })
  activeKey = ["1"]
  /**
   * 外观设置
   */
  @property({ type: Object })
  appearance: Appearance = {
    bordered: true,
    position: "左",
    ghost: false,
  };

  datalistPreprocess(data: any[]) {
    return {
      key: String(this.datalist.length + 1),
      label: `默认标题${this.datalist.length + 1}`,
      bgcolor: "#ffffff",
      disabled: false,
      actived: false,
      showArrow: true,
    };
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

  render() {
    // 初始化数据
    return html`
      <div id="container" class="q-collapse-container"></div>
    `;
  }

  // dropEcho(DragDrop: any) {
  //   DragDrop.dropEventMount(this)
  // }

  // dropCreated(DragDrop: any) {
  //   DragDrop.dropEventMount(this)
  // }

  disconnectedCallback(): void {
    if (!this.isConnected) {
      // 断开文档连接，说明元件已被删除
      unmountInstance(this);
    }
    super.disconnectedCallback();
  }

  connectedCallback(): void {
    if (!this.componentInstance && this.container) {
      createVueComponent(this);
    }
    super.connectedCallback();
  }

  protected updated(): void {
    if (this.container) {
      unmountInstance(this);
      createVueComponent(this);
    }
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-collapse";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "折叠面板";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "用于数据展示";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "展开指定面板",
                eventType: "expandCollapse",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "展开面板",
                eventType: "ExpandCollapse",
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
                datalist: {
                  type: "array",
                  description: "数据项",
                  items: {
                    type: "object",
                    description: "单项",
                    preprocess: "datalistPreprocess",
                    properties: {
                      label: {
                        type: "string",
                        description: "头文字",
                      },
                      bgcolor: {
                        type: "string",
                        description: "背景色",
                        format: "color",
                      },
                      disabled: {
                        type: "boolean",
                        description: "是否禁用",
                      },
                      actived: {
                        type: "boolean",
                        description: "默认展开",
                      },
                      showArrow: {
                        type: "boolean",
                        description: "显示图标",
                      },
                    },
                  },
                },
                appearance: {
                  type: "object",
                  description: "外观设置",
                  properties: {
                    bordered: {
                      type: "boolean",
                      description: "带边框",
                    },
                    position: {
                      type: "string",
                      description: "图标位置",
                      enum: ["左", "右"],
                    },
                    ghost: {
                      type: "boolean",
                      description: "无背景",
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
        _initStyle: "height:360px;width:560px;",
        _onMessageMeta: {
          expandCollapse: [
            (e: IMessage) => {
              console.log("expandCollapse", e);
              // @ts-ignore
              const _this = this.el;
              // _this.visible = true
              // _this.requestUpdate("visible")
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
        get datalist() {
          return self.datalist;
        },
        set datalist(value) {
          self.datalist = value;
          self.activeKey = self.datalist.filter((v:any) => v.actived).map((v:any) => v.key)
          self.requestUpdate("datalist");
        },
        get appearance() {
          return self.appearance;
        },
        set appearance(value) {
          self.appearance = value;
          self.requestUpdate("appearance");
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-collapse": QCollapse;
  }
}
