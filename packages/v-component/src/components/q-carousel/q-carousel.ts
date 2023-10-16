import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { ISchema, EComponentType, EComponentGroup } from "../../types/runtime/IModelSchema";
import { Component } from "../../types/runtime/Component";
import { createVueComponent } from "./component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { unmountInstance } from "../../util/utils";
import antdCss from "ant-design-vue/dist/antd.min.css?inline";
import cssIndex from "./index.scss?inline?inline";
import { IMessage } from "../../types/runtime/IMessage";

/**
 * 折叠面板
 */
@customElement("q-carousel")
export class QCarousel extends Component {
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
  // 自动播放
  @property({ type: Boolean })
  public autoplay = false;
  // 指示点
  @property({ type: Object })
  dots = {
    enable: true,
    image: false,
  };
  // 箭头
  @property({ type: Boolean })
  public arrows = true;
  // 位置
  @property({ type: String })
  public dotPosition = "下"; // top bottom left right
  // 切换效果
  @property({ type: String })
  public effect = "滚动"; // scrollx | fade
  // 动画效果
  @property({ type: String })
  public easing = "linear"; // linear | ease | ease-in | ease-out | ease-in-out
  // 图片尺寸
  @property({ type: String })
  public imageSize = "铺满"; // default | contain

  

  /**
   * 图片数据 imglist
   */
  @property({ type: Array, attribute: "imglist" })
  imglist = [
    {
      url: "data:image/png;base64,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",
      title: "",
      alt: ""
    },
    {
      url: "http://192.168.21.46:5000/images/ui-builder-logo.svg",
      title: "",
      alt: "",
    },
  ];

  prev() {
    this.componentInstance._instance.refs.qCarouselRef.prev();
  }
  next() {
    this.componentInstance._instance.refs.qCarouselRef.next();
  }
  goTo(n: string | number, dontAnimate: boolean) {
    this.componentInstance._instance.refs.qCarouselRef.goTo(n, dontAnimate);
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
      <div id="container" class="q-carousel-container"></div>
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
            return "q-carousel";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "走马灯";
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
                text: "切换到上一面板",
                eventType: "prev",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "切换到下一面板",
                eventType: "next",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "切换到指定面板",
                eventType: "goTo",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "切换之后",
                eventType: "AfterChange",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "切换之前",
                eventType: "BeforeChange",
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
                imglist: {
                  type: "array",
                  description: "数据项",
                  items: {
                    type: "object",
                    description: "单项",
                    properties: {
                      url: {
                        type: "string",
                        format: "resource",
                        description: "图片链接",
                      },
                      title: {
                        type: "string",
                        description: "标题",
                      },
                      alt: {
                        type: "string",
                        description: "代替文字",
                      },
                    },
                  },
                },
                imageSize: {
                  type: "string",
                  description: "图片大小",
                  enum: ['默认', '铺满']
                },
                autoplay: {
                  type: "boolean",
                  description: "自动播放",
                },
                dots: {
                  type: "object",
                  description: "指示点",
                  properties: {
                    enable: {
                      type: "boolean",
                      description: "是否启用",
                    },
                    image: {
                      type: "boolean",
                      description: "缩略图",
                    },
                  },
                },
                arrows: {
                  type: "boolean",
                  description: "箭头",
                },
                dotPosition: {
                  type: "string",
                  description: "指示点位置",
                  enum: ["上", "右", "下", "左"],
                },
                effect: {
                  type: "string",
                  description: "切换效果",
                  enum: ["滚动", "渐显"],
                },
                easing: {
                  type: "string",
                  description: "动画效果",
                  enum: ["linear", "ease", "ease-in", "ease-out", "ease-in-out"],
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
        _initStyle: "width: 415px; height: 211px;",
        _onMessageMeta: {
          prev: [
            (e: IMessage) => {
              console.log("prev", e.body);
              // const _this = this.el;
              // @ts-ignore
              this.el.prev();
            },
          ],
          next: [
            (e: IMessage) => {
              console.log("next", e.body);
              // @ts-ignore
              const _this = this.el;
              _this.next();
            },
          ],
          goTo: [
            (e: IMessage) => {
              console.log("goTo", e.body);
              // @ts-ignore
              const _this = this.el;
              _this.goTo(e.body);
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
        get autoplay() {
          return self.autoplay;
        },
        set autoplay(value) {
          self.autoplay = value;
          self.requestUpdate("autoplay");
        },
        get imageSize() {
          return self.imageSize;
        },
        set imageSize(value) {
          self.imageSize = value;
          self.requestUpdate("imageSize");
        },
        get dots() {
          return self.dots;
        },
        set dots(value) {
          self.dots = value;
          self.requestUpdate("dots");
        },
        get arrows() {
          return self.arrows;
        },
        set arrows(value) {
          self.arrows = value;
          self.requestUpdate("arrows");
        },
        get dotPosition() {
          return self.dotPosition;
        },
        set dotPosition(value) {
          self.dotPosition = value;
          self.requestUpdate("dotPosition");
        },
        get effect() {
          return self.effect;
        },
        set effect(value) {
          self.effect = value;
          self.requestUpdate("effect");
        },
        get easing() {
          return self.easing;
        },
        set easing(value) {
          self.easing = value;
          self.requestUpdate("easing");
        },
        get imglist() {
          return self.imglist;
        },
        set imglist(value) {
          self.imglist = value;
          self.requestUpdate("imglist");
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-carousel": QCarousel;
  }
}
