import { css, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import cssIndex from "./index.scss?inline";
import { createHash, containerPropsIgnore } from "../../util/utils";
import $ from "jquery";
// import { styleMap } from "lit/directives/style-map.js";

/**
 * 文本组件
 *
 */
@customElement("q-grid-box")
export class QGridBox extends LitElement {
  static styles = css`${unsafeCSS(cssIndex)}`;

  /**
   * 收缩方向
   */
  @changeProperty()
  @property({ type: String })
  position = "左";

  /**
   * 最小宽度
   */
  @changeProperty()
  @property({ type: Number })
  minLength = 8;

  @query(".q-flex-box")
  qShrink!: HTMLDivElement;
  /**
   * 数据模型
   */
  componentModel!: ComponentModel;


  /**
   * flex描述
   */
  @property({ type: String })
  flexDirection = "横向 row"

  /**
   * flex-wrap描述
   */
  @property({ type: String })
  flexWrap = "单行 nowrap"

  ob!: MutationObserver
  constructor() {
    super();
    this.initModel();
  }

  protected async update(changedProperties: PropertyValues) {
    super.update(changedProperties);
    console.log("update.....");
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete
    this.ob = containerPropsIgnore(document.getElementById(this.id)!,["position","left", "top"],(mutationsList: MutationRecord[], observer: MutationObserver) => {
      // if(this.flexWrap === "多行 wrap"){
      //   (mutationsList[0].target as HTMLElement).style.flexGrow = String(1)
      // }else{
      //   (document.getElementById(this.id)!.firstChild as HTMLElement).style.flexGrow = String(1)
      // }
    })
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);
    console.log("change");
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.ob?.disconnect()
  }

  protected async firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    // 增加收缩标识
    await this.updateComplete;
  }

  /**
   * 存储原始容器长度
   */


  render() {
    return html`
      <div class="q-grid-box">
        <div class="q-grid-box-content">
          <slot id="${"q-grid-box-slot-" + createHash()}" class="dropzone q-grid-box-slot">
            <q-container-mask text="组件降落区" style="width: 100%;display: grid"></q-container-mask>
          </slot>
        </div>
      </div>
    `;
  }

  onSendMessage(value: {}) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: "throwMessage",
        dstType: ""
      },
      body: value
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
            return "q-grid-box";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "网格布局";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "可收缩容器";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "触发组件收缩",
                eventType: "shrink",
                messageSchema: "",
                messageDemo: ""
              }
            ],
            outputMessage: [
              {
                text: "收缩状态消息发送",
                eventType: "throwMessage",
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
                flexDirection: {
                  type: "string",
                  description: "主轴方向",
                  enum: ["横向 row", "横向颠倒 row-reverse", "纵向 column", "纵向颠倒 column-reverse"]
                },
                flexWrap: {
                  type: "string",
                  description: "堆叠方向",
                  enum: ["单行 nowrap", "多行 wrap", "多行颠倒 wrap-reverse"]
                },
                minLength: {
                  type: "number",
                  description: "收缩后显示宽度",
                  min: 0,
                  max: 999999
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
          shrink: [
            function(e: IMessage) {
              // @ts-ignore
              const self = this;
            }
          ],
          throwMessage: [
            function(e: IMessage) {
              // @ts-ignore
              // const self = this;
              this.onSendMessage({ isExpand: $(this.qShrink).attr("expand") === "true", position: this.position });
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
        _initStyle: "height:150px;width:150px;background-color:#fff",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function() {
          },
          updated: function(el: any, model: any) {
          },
          destroy: function() {
          }
        },
        get minLength() {
          return self.minLength;
        },
        set minLength(value) {
          if (value === self.minLength) {
            return;
          }
          self.minLength = value;
        },
        get flexDirection() {
          return self.flexDirection;
        },
        set flexDirection(value) {
          if (value === self.flexDirection) {
            return;
          }
          self.flexDirection = value;
        },
        get flexWrap() {
          return self.flexWrap;
        },
        set flexWrap(value) {
          if (value === self.flexWrap) {
            return;
          }
          self.flexWrap = value;
        },
        _eventInterception: {}
      } as unknown as ISchema
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-grid-box": QGridBox;
  }
}
