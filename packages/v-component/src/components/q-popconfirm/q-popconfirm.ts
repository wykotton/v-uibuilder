import { css, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { ISchema, EComponentType, EComponentGroup } from "../../types/runtime/IModelSchema";
import { Component } from "../../types/runtime/Component";
import { createVueComponent } from "./component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import antdCss from "ant-design-vue/dist/antd.min.css?inline";
import cssIndex from "./index.scss?inline?inline";
import { IMessage } from "../../types/runtime/IMessage";
import { Header } from "./IQPopconfirm";

/**
 * 气泡框
 */
@customElement("q-popconfirm")
export class QPopoverly extends Component {
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
  public visible = true;
  // 宽度
  @property({ type: String })
  public trigger = "点击";
  /**
   * 外观设置
   */
  @property({ type: Object })
  public header: Header = {
    enable: true,
    title: "默认标题",
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

  render() {
    // 初始化数据
    const div = document.createElement("div");
    div.id = "container";
    div.className = "q-popover-container";
    return div;
  }

  // dropEcho(DragDrop: any) {
  //   DragDrop.dropEventMount(this)
  // }

  // dropCreated(DragDrop: any) {
  //   DragDrop.dropEventMount(this)
  // }

  disconnectedCallback(): void {
    this.componentInstance.unmount();
    super.disconnectedCallback();
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    createVueComponent(this);
  }

  protected updated(): void {
    createVueComponent(this);
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-popconfirm";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "气泡卡片";
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
                text: "展开",
                eventType: "open",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "关闭",
                eventType: "close",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "展开",
                eventType: "Open",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "关闭",
                eventType: "Close",
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
                trigger: {
                  type: "string",
                  description: "触发方式",
                  enum: ["点击", "悬停"],
                },
                header: {
                  type: "object",
                  description: "标题栏",
                  properties: {
                    enable: {
                      type: "boolean",
                      description: "是否启用",
                    },
                    title: {
                      type: "string",
                      description: "标题文字",
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
        _initStyle: "width:100px;height:45px;",
        _onMessageMeta: {
          open: [
            (e: IMessage) => {
              console.log("open", e.body);
              // @ts-ignore
              const _this = this.el;
              _this.visible = true;
              _this.requestUpdate("visible");
            },
          ],
          close: [
            (e: IMessage) => {
              console.log("close", e);
              // @ts-ignore
              // const _this = this.el
              this.el.visible = false;
              // @ts-ignore
              this.el.requestUpdate("visible");
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
        get trigger() {
          return self.trigger;
        },
        set trigger(value) {
          self.trigger = value;
          self.requestUpdate("trigger");
        },
        get header() {
          return self.header;
        },
        set header(value) {
          self.header = value;
          self.requestUpdate("header");
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-popconfirm": QPopoverly;
  }
}
