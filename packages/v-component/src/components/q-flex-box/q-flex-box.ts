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
import { styleMap } from "lit/directives/style-map.js";

/**
 * 文本组件
 *
 */
@customElement("q-flex-box")
export class QFlexBox extends LitElement {
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


  contextType = false;

  /**
   * flex描述
   */
  @property({ type: String })
  flexDirection = "从左到右 row";

  /**
   * flex-wrap描述
   */
  @property({ type: String })
  flexWrap = "单行 nowrap";

  ob!: MutationObserver;

  constructor() {
    super();
    this.initModel();
  }

  protected async update(changedProperties: PropertyValues) {
    super.update(changedProperties);
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    this.setFlexboxOb();
  }

  // 设置弹力盒子监听
  setFlexboxOb() {
    this.ob = containerPropsIgnore(document.getElementById(this.id)!, ["position", "left", "top"], (mutationsList: MutationRecord[], observer: MutationObserver, el: HTMLElement) => {
      // console.log("弹力盒子MutationObserver");
      mutationsList.forEach((mutation) => {
        switch (mutation.type) {
          case "childList":
            setTimeout(() => {
              const firstNode = (document.getElementById(this.id)?.firstChild as HTMLElement)
              if (firstNode){
                $(firstNode).css("flex", 1);
                // (firstNode as any).componentModel.model._initStyle = firstNode.style.cssText;
              };
            } ,50)
            if ((this.flexDirection === "从上到下 column" || this.flexDirection === "从下到上 column-reverse") && mutation.addedNodes.length) {
              mutation.addedNodes.forEach((it => {
                if ((it as HTMLElement).style.width !== "100%" && (it.parentElement as HTMLElement).tagName === "Q-FLEX-BOX"){
                  $(it).width("100%")
                };
                // (it as any).componentModel.model._initStyle =  (it as HTMLElement).style.cssText;
              }));
            }else {
              // mutation.addedNodes.forEach((it => {
              //   if ((document.getElementById(this.id)?.firstChild as HTMLElement)?.id === (it as HTMLElement).id) $(it).css("flex", 1);
              // }));
            }
            break;
          case "attributes":
            const curNode = document.getElementById(this.id)?.firstChild as HTMLElement;
            if (curNode) $(curNode).css("flex", 1);
            if (this.flexDirection === "从上到下 column" || this.flexDirection === "从下到上 column-reverse") {
              if ((mutation.target as HTMLElement).style.width !== "100%" && (mutation.target.parentElement as HTMLElement).tagName === "Q-FLEX-BOX" && ((mutation.target as HTMLElement).id !== this.id)) (mutation.target as HTMLElement).style.width = "100%";
            }
            break;
        }
      });
    });
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);
    console.log("change");
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if(!this?.shadowRoot?.isConnected){
      this.ob?.disconnect();
    }
    this.ob?.disconnect();
  }

  protected async firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    // 增加收缩标识
    await this.updateComplete;
  }

  updateStyle(el: any, value: string) {
    const div = document.createElement("div");
    div.style.cssText = value;

  }


  /**
   * 存储原始容器长度
   */


  render() {
    return html`
      <div class="q-flex-box">
        <div class="q-flex-box-content">
          <slot id="${"q-flex-box-slot-" + createHash()}" class="dropzone q-flex-box-slot" style=${styleMap({
            "flex-wrap": this.flexWrap.split(" ")[1],
            "flex-direction": this.flexDirection.split(" ")[1]
          })}>
            <q-container-mask text="组件降落区" style="width: 100%;height: 100%"></q-container-mask>
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

  async distroyOb() {
    await this.updateComplete;
    setTimeout(() => {
      this.ob?.disconnect();
      this.ob = null as any;
    }, 1500);
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-flex-box";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "弹力盒子";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "弹力盒子";
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
                  description: "元素排列方向",
                  enum: ["从左到右 row", "从右到左 row-reverse", "从上到下 column", "从下到上 column-reverse"]
                }
                // flexWrap: {
                //   type: "string",
                //   description: "堆叠方向",
                //   enum: ["单行 nowrap", "多行 wrap", "多行颠倒 wrap-reverse"]
                // }
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
        _onWatchSetting: {
          contextType: [
            function (newVal: any, oldVal: any, context: any) {
            const node = document.querySelector(`#${context.id}`)
              if(!node) return
              if(newVal){
                // @ts-ignore
                node.distroyOb().then();
              }else {
                // @ts-ignore
                node.setFlexboxOb();
              }
            },
          ]
        },
        _lifeCycle: {
          created: function() {
          },
          updated: function(el: any, model: any) {
            // @ts-ignore
            if(this.contextType !== model.contextType)  this.contextType = model.contextType;
            if (el.flexDirection === "从上到下 column" || el.flexDirection === "从下到上 column-reverse") {
              Array.from(el.children).map((it, i) => {
                if (i === 0) (it as HTMLElement).style.flex = "1";
                (it as HTMLElement).style.width = "100%";
                // (it as any).componentModel.model._initStyle =  (it as HTMLElement).style.cssText;
              });
            }
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
        get contextType() {
          return self.contextType;
        },
        set contextType(value) {
          if (value === self.contextType) {
            return;
          }
          self.contextType = value;
        },
        // get flexWrap() {
        //   return self.flexWrap;
        // },
        // set flexWrap(value) {
        //   if (value === self.flexWrap) {
        //     return;
        //   }
        //   self.flexWrap = value;
        // },
        _eventInterception: {}
      } as unknown as ISchema
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-flex-box": QFlexBox;
  }
}
