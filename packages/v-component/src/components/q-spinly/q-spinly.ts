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
import { unmountInstance } from "../../util/utils";

/**
 * 加载中
 */
@customElement("q-spinly")
export class QSpinly extends Component {
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
  public spinning = false;
  // 宽度
  @property({ type: Number })
  public delay = 0;
  // 宽度
  @property({ type: String })
  public size = "中"; // small default large
  // 宽度
  @property({ type: String })
  public tip = "";

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
      <div id="container" class="q-spin-container"></div>
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

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    if (!this.componentInstance && this.container) {
      createVueComponent(this);
    }
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
            return "q-spinly";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "加载中";
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
                text: "开启加载",
                eventType: "start",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "关闭加载",
                eventType: "end",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                spinning: {
                  type: "boolean",
                  description: "加载状态",
                },
                delay: {
                  type: "number",
                  description: "延迟时间",
                },
                size: {
                  type: "string",
                  description: "组件大小",
                  enum: ["小", "中", "大"],
                },
                tip: {
                  type: "string",
                  description: "文字描述",
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
          start: [
            (e: IMessage) => {
              console.log("start", e.body);
              // const _this = this.el;
              // @ts-ignore
              this.el.spinning = true;
              // @ts-ignore
              this.el.requestUpdate("spinning");
            },
          ],
          end: [
            (e: IMessage) => {
              console.log("end", e);
              // @ts-ignore
              const _this = this.el;
              _this.spinning = false;
              _this.requestUpdate("spinning");
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
        get spinning() {
          return self.spinning;
        },
        set spinning(value) {
          self.spinning = value;
          self.requestUpdate("spinning");
        },
        get delay() {
          return self.delay;
        },
        set delay(value) {
          self.delay = value;
          self.requestUpdate("delay");
        },
        get size() {
          return self.size;
        },
        set size(value) {
          self.size = value;
          self.requestUpdate("size");
        },
        get tip() {
          return self.tip;
        },
        set tip(value) {
          self.tip = value;
          self.requestUpdate("tip");
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-spinly": QSpinly;
  }
}
