import { css, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isEqual, debounce } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import cssIndex from "./index.scss?inline";
import { containerPropsIgnore, createHash, booleanTransform } from "../../util/utils";
import $ from "jquery";

/**
 * 文本组件
 *
 */
@customElement("q-shrink")
export class QShrink extends LitElement {
  static styles = css`
    ${unsafeCSS(cssIndex)}
  `;

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
  minLength = 0;

  @query(".q-shrink")
  qShrink!: HTMLDivElement;

  contextType = false;

  @property({ type: Number })
  borderWidth = 0;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  isHeightFull = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  isWidthFull = false;


  // 是否隐藏子元素
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  isShow = false;

  ob!: MutationObserver;
  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  constructor() {
    super();
    this.initModel();
  }

  protected async update(changedProperties: PropertyValues) {
    super.update(changedProperties);
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    this.setOb();
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
    if (this.qShrink) {
      if ($(this.qShrink).attr("expand") === undefined) $(this.qShrink).attr("expand", "true");
      // await this.setDefaultLength();
    }
  }

  /**
   * 存储原始容器长度
   */
  async setDefaultLength() {
    await this.updateComplete;
    if (!this.qShrink) return;
    const tempNode = document.getElementById(this.id) as HTMLElement;
    let length: any = 0;
    switch (this.position) {
      case "左":
      case "右":
        // const tempNode = document.getElementById(this.id)
        length = tempNode.getBoundingClientRect().width;
        break;
      case "上":
      case "下":
        length = tempNode.getBoundingClientRect().height;
        break;
    }
    $(this.qShrink).attr("length", length);
  }

  containerShrink = debounce((state?: string) => {

    if (!this.qShrink) return;
    const isExpand = $(this.qShrink).attr("expand") === "true";
    if(isExpand){
      this.setDefaultLength()
    }
    if(state && ((state === "hide") === !isExpand)) return
    const position = this.position;
    const minLength = this.minLength;
    const curNode = $(`#${this.id}`);
    const temp = $(this.qShrink);
    const left = curNode.position().left;
    const top = curNode.position().top;
    const length = +(temp.attr("length") || 0);
    const duration = 300;
    if (isExpand) {
      // 展开时
      switch (position) {
        case "左":
          curNode.animate({ width: minLength }, duration);
          break;
        case "右":
          curNode.animate({ width: minLength, left: length + left - minLength }, duration);
          break;
        case "上":
          curNode.animate({ height: minLength }, duration);
          break;
        case "下":
          curNode.animate({ height: minLength, top: length + top - minLength }, duration);
          break;
      }
      temp.attr("expand", "false");
      this.isShow && temp.find(".q-shrink-content").hide();
      curNode.css("borderWidth", 0);
    } else {
      switch (position) {
        case "左":
          curNode.animate({ width: length }, duration);
          break;
        case "右":
          curNode.animate({ width: length, left: Math.abs(left - length) + minLength }, duration);
          break;
        case "上":
          curNode.animate({ height: length }, duration);
          break;
        case "下":
          curNode.animate({ height: length, top: Math.abs(top - length) + minLength }, duration);
          break;
      }
      temp.attr("expand", "true");
      this.isShow && temp.find(".q-shrink-content").show();
      curNode.css("borderWidth", this.borderWidth);
    }
    this.onSendMessage({ isExpand, position });
  }, 300);

  async distroyOb() {
    await this.updateComplete;
    setTimeout(() => {
      this.ob?.disconnect();
      this.ob = null as any;
    }, 1500);
  }

  setOb() {
    this.ob = containerPropsIgnore(document.getElementById(this.id)!, [], (mutationsList: MutationRecord[]) => {
      mutationsList.forEach((mutation) => {
        switch (mutation.type) {
          case "childList":
            mutation.addedNodes.forEach((it: any) => {
              if (this.isWidthFull) {
                $(it).attr("oldWidth", it.style.width);
                $(it).width("100%");
              }
              if (this.isHeightFull) {
                $(it).attr("oldHeight", it.style.height);
                $(it).height("100%");
              }
            });
            break;
          case "attributes":
            this.isWidthFull &&
              (mutation.target as HTMLElement).id !== this.id &&
              $(mutation.target as HTMLElement).width("100%");
            this.isHeightFull &&
              (mutation.target as HTMLElement).id !== this.id &&
              $(mutation.target as HTMLElement).height("100%");
            break;
        }
      });
    });
  }

  percentageConversion(value: boolean, position: string) {
    const node = document.querySelector(`#${this.id}`);
    if (value) {
      node &&
        Array.from(node.children).map((it: any) => {
          it.setAttribute(`old${position}`, it.style[position]);
          it.style[position] = "100%";
        });
    } else {
      node &&
        Array.from(node.children).map((it: any) => {
          it.style[position] = it.getAttribute(`old${position}`) || "100%";
        });
    }
  }

  render() {
    return html`
      <div class="q-shrink">
        <div class="q-shrink-content">
          <slot id="${"q-shrink-slot-" + createHash()}" class="dropzone">
            <q-container-mask text="组件降落区"></q-container-mask>
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
        dstType: "",
      },
      body: value,
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
            return "q-shrink";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "收缩面板";
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
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "收缩状态消息发送",
                eventType: "throwMessage",
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
                position: {
                  type: "string",
                  description: "收缩方向",
                  enum: ["左", "上", "下", "右"],
                },
                minLength: {
                  type: "number",
                  description: "收缩后显示宽度",
                  min: 0,
                  max: 999999,
                },
                isWidthFull: {
                  type: "boolean",
                  description: "开启子组件宽度100%",
                },
                isHeightFull: {
                  type: "boolean",
                  description: "开启子高度100%",
                },
                isShow: {
                  type: "boolean",
                  description: "收缩后隐藏子元素",
                }
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
        _onMessageMeta: {
          shrink: [
            function (e: IMessage) {
              // @ts-ignore
              this.containerShrink(e.body === "hide" || e.body === "show" ? e.body : "");
            },
          ],
          throwMessage: [
            function () {
              // @ts-ignore
              this.onSendMessage({ isExpand: this.qShrink.getAttribute("expand") === "true", position: this.position });
            },
          ],
        },
        _onDOMEvent: {
          click: [
            function (e: Event) {
              console.log(e);
            },
          ],
          dblclick: [
            function (e: Event) {
              console.log(e, "dblclick");
            },
          ],
        },
        _initStyle: "height:150px;width:150px;background-color: #fff;",
        _onWatchSetting: {
          contextType: [
            function (newVal: any, oldVal: any, context: any) {
              if (newVal) {
                // @ts-ignore
                this.distroyOb().then();
              } else {
                // @ts-ignore
                this.setOb();
              }
            },
          ],
        },
        _lifeCycle: {
          created: function () {},
          updated: function (el: any, model: any) {
            // @ts-ignore
            if (this.contextType !== model.contextType) this.contextType = model.contextType;
            // @ts-ignore
            if (this.qShrink && this.qShrink.getAttribute("expand") === "true") {
              // @ts-ignore
              this.setDefaultLength().then();
              // @ts-ignore
              this.borderWidth = parseInt(el.style.borderWidth) || 0;
            }
          },
          destroy: function () {},
        },
        get position() {
          return self.position;
        },
        set position(value) {
          if (value === self.position) {
            return;
          }
          self.position = value;
        },
        get borderWidth() {
          return self.borderWidth;
        },
        set borderWidth(value) {
          if (value === self.borderWidth) {
            return;
          }
          self.borderWidth = value;
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
        get isHeightFull() {
          return self.isHeightFull;
        },
        set isHeightFull(value) {
          if (value === self.isHeightFull) {
            return;
          }
          self.percentageConversion(value, "height");
          self.isHeightFull = value;
        },
        get isWidthFull() {
          return self.isWidthFull;
        },
        set isWidthFull(value) {
          if (value === self.isWidthFull) {
            return;
          }
          self.percentageConversion(value, "width");
          self.isWidthFull = value;
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
        get isShow() {
          return self.isShow;
        },
        set isShow(value) {
          if (value === self.isShow) {
            return;
          }
          self.isShow = value;
        },
        _eventInterception: {},
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-shrink": QShrink;
  }
}
