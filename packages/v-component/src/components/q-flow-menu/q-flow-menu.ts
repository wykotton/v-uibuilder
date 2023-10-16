import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isArray, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createHash } from "../../util/utils";
import { QPopover } from "../q-popover/q-popover";
import "../q-popover/q-popover";
import { styleMap } from "lit/directives/style-map.js";
/**
 * 文本组件
 */
@customElement("q-flow-menu")
export class QFlowMenu extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    :host .flow-wrapper .flow-menu-item {
      text-align: center;
      height: 37px;
      line-height: 37px;
      background: inherit;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }



    :host > q-popover {
      width: 100%;
      height: 100%;
      background: inherit;
    }

    :host .first-menu {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }


    :host .show {
      display: block;
    }

    :host .not-show {
      display: none;
    }

    :host .flow-wrapper {
      vertical-align: top;
      background: inherit;
      border-radius: 2px;
      box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
      transition: margin .3s;
    }

    p {
      margin: 0;
      word-break: break-all;
    }
  `;

  @query("q-popover")
  public popoverRef!: QPopover;

  @changeProperty()

  @property({ type: Object, attribute: "children-style" })
  public childrenStyle = {}

  // @property({ type: Object, attribute: "children-style" })
  public activeBackgroundColor = "#ecf5ff"

  /**
   * 绑定data数据
   */
  @property({ type: String, attribute: "text" })
  menuData = [
    { title: "菜单1", key: `menu-${createHash()}` },
    { title: "菜单2", key: `menu-${createHash()}` },
    { title: "菜单3", key: `menu-${createHash()}` },
    { title: "菜单4", key: `menu-${createHash()}` }
  ];
  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  constructor() {
    super();
    this.initModel();
  }


  /**
   * 菜单点击
   */
  flowMenuClick(e: Event, isLeave?: string) {
    const { target } = e;
    if (target) {
      const key = (<HTMLTextAreaElement>target).getAttribute("key");
      this.onSendMessage("click", key);
    }
    Promise.resolve().then(() => {
      isLeave === "needLeave" && this.popoverRef?.leave?.();
    });
  }


  render() {
    return html`
      <style>
        :host .flow-menu-item:hover,
        :host .flow-wrapper .flow-menu-item:hover {
          background: ${this.activeBackgroundColor};
          cursor: pointer;
        }
        :host .flow-wrapper .flow-menu-item {
          max-width: ${this.style.width};
        }
      </style>
      <q-popover trigger="click" position="bottom" showArrow="false">
        <div class="flow-menu-item first-menu"
             key="${this.menuData[0].key}" @click="${(e: Event) => this.flowMenuClick(e)}">
          ${this.menuData[0].title}
        </div>
        <div slot="popover" class="flow-wrapper" tip="popover" style=${styleMap(this.childrenStyle)}>
          ${this.menuData.map((it, i) => {
            if (i === 0) return;
            return html`
              <div class="flow-menu-item" key="${it.key}" @click="${(e: Event) => this.flowMenuClick(e, "needLeave")}">${it.title}</div>
            `;
          })}
        </div>
      </q-popover>
    `;
  }

  onSendMessage(type: string, value: any) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: type,
        dstType: ""
      },
      body: value
    };
    this.componentModel.sendMessage(message);
  }

  clickFont(e: Event) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: e.type,
        dstType: ""
      },
      body: ""
    };
    this.componentModel.sendMessage(message);
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-flow-menu";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "浮动菜单";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "文本组件,可以编写文字信息";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              // {
              //   text: "触发组件点击",
              //   eventType: "triggerClick",
              //   messageSchema: "",
              //   messageDemo: ""
              // }
            ],
            outputMessage: [
              {
                text: "组件点击数据",
                eventType: "click",
                messageSchema: "",
                messageDemo: "文本数据1"
              }
            ]
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                menuData: {
                  type: "array",
                  description: "菜单数据",
                  items: {
                    type: "object",
                    description: "子项数据",
                    properties: {
                      title: {
                        type: "string",
                        description: "菜单名称",
                      },
                      key: {
                        type: "string",
                        description: "菜单id",
                      }
                    },
                  },
                },
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
          click: [
            function(e: IMessage) {
              // @ts-ignore
              this.flowMenuClick(e);
            }
          ],
          triggerClick: [
            function(e: IMessage) {
              // @ts-ignore
              // eslint-disable-next-line @typescript-eslint/no-this-alias
              // const _this = this
              // const { key } = e.body
              // if(key){
              //   const keyNode = _this.renderRoot.querySelector(`[key=${key}}]`);
              //   keyNode && (($(keyNode) as any).trigger("click"))
              // }
              this.onSendMessage("click", e.body);
            }
          ]
        },
        _onDOMEvent: {
          click: [
            function(e: Event) {
              console.log(e);
            }
          ],
          dblclick: [
            function(e: Event) {
              console.log(e, "dblclick");
            }
          ]
        },
        _initStyle: "height:37px;width:150px;",
        _onWatchSetting: {

        },
        get initStyle() {
          // @ts-ignore
          return this._initStyle;
        },
        set initStyle(value) {
          const div = document.createElement("div");
          div.style.cssText = value;
          // @ts-ignore
          this._initStyle = div.style.cssText;
          if(self.shadowRoot){
            // @ts-ignore
            (<HTMLElement>self.shadowRoot.host).style.cssText = this._initStyle;
          }
          self.childrenStyle = {background: div.style.background, color: div.style.color}
          self.style.cssText = div.style.cssText;
          self.requestUpdate()
        },
        _lifeCycle: {
          created: function() {
          },
          updated: function() {
          },
          destroy: function() {
          }
        },
        get menuData() {
          return self.menuData.map(it => {
            if(!it) it = {title: "", key: `menu-${createHash()}`}
            it.key = it.key ? it.key : `menu-${createHash()}`
            return it
          });
        },
        set menuData(value) {
          if (!isArray(value) || isEqual(value, self.menuData)) return;
          self.menuData = value;
        },
        get activeBackgroundColor() {
          return self.activeBackgroundColor
        },
        set activeBackgroundColor(v) {
          if(self.activeBackgroundColor !== v) self.activeBackgroundColor = v
        }
      } as unknown as ISchema
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-flow-menu": QFlowMenu;
  }
}
